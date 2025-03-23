const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const sqlLogger = require("./middleware/sql-logger")
require('dotenv').config();

const app = express();
const client = new Client({
    connectionString: process.env.DATABASE_URL || "postgres://root@localhost:5432/hotel",
});

client.connect();

app.use(cors({
    exposedHeaders: ['X-Sql-Queries', 'Content-Type']
}));
app.use(bodyParser.json());

app.use(sqlLogger(client))

app.use((req, res, next) => {
    const originalQuery = client.query
    client.query = function (...args) {
        const query = args[0]
        const params = args.length > 1 && Array.isArray(args[1]) ? args[1] : []

        return originalQuery.apply(this, args).then((result) => {
            res.locals._sql = {
                query: typeof query === "string" ? query : query.text,
                params: params,
            };
            return result;
        });

    }

    next()
})

// Endpoint to search for available rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const { start_date, end_date, capacity, price, hotel_chain, view, condition, extendable, amenities } = req.query;

        let query = `SELECT Room.*, 
                    Hotel.name AS hotel_name, 
                    Hotel.classification AS hotel_classification, 
                    HotelChain.name AS chain_name 
             FROM Room
             JOIN Hotel ON Room.hotel_id = Hotel.hotel_id
             LEFT JOIN HotelChain ON Hotel.chain_id = HotelChain.chain_id
             WHERE 1=1`;

        const queryParams = [];
        let paramIndex = 1;

        if (price) {
            query += ` AND Room.price <= $${paramIndex}`;
            queryParams.push(price);
            paramIndex++;
        }

        if (capacity) {
            query += ` AND Room.capacity >= $${paramIndex}`;
            queryParams.push(capacity);
            paramIndex++;
        }

        if (view && view !== "any") {
            query += ` AND Room.view = $${paramIndex}`;
            queryParams.push(view);
            paramIndex++;
        }

        if (condition && condition !== "any") {
            query += ` AND Room.condition = $${paramIndex}`;
            queryParams.push(condition);
            paramIndex++;
        }

        if (extendable !== undefined) {
            query += ` AND Room.extendable = $${paramIndex}`;
            queryParams.push(extendable === 'true');
            paramIndex++;
        }

        if (amenities) {
            query += ` AND Room.amenities ILIKE $${paramIndex}`;
            queryParams.push(`%${amenities}%`);
            paramIndex++;
        }

        if (start_date && end_date) {
            query += ` AND Room.room_id NOT IN (
                        SELECT room_id FROM Reservation WHERE 
                        (start_date <= to_TIMESTAMP($${paramIndex}, 'YYYY-MM-DD') AND end_date >= to_TIMESTAMP($${paramIndex + 1}, 'YYYY-MM-DD'))
                        OR
                        (start_date <= to_TIMESTAMP($${paramIndex + 2}, 'YYYY-MM-DD') AND end_date >= to_TIMESTAMP($${paramIndex + 3}, 'YYYY-MM-DD'))
                     )`;
            queryParams.push(start_date, end_date, start_date, end_date);
            paramIndex += 4;
        }

        if (hotel_chain) {
            query += ` AND Hotel.chain_id = $${paramIndex}`;
            queryParams.push(hotel_chain);
        }

        const result = await client.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to make a reservation
app.post('/api/reservation', async (req, res) => {
    try {
        const { guest_id, room_id, start_date, end_date } = req.body;
        const query = 'INSERT INTO Reservation (guest_id, room_id, start_date, end_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const result = await client.query(query, [guest_id, room_id, start_date, end_date, 'Booked']);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to convert reservation to rental
app.put('/api/rental/:reservation_id', async (req, res) => {
    try {
        const { reservation_id } = req.params;
        const { employee_id, checkin_date, checkout_date } = req.body;
        const query = 'INSERT INTO Rental (reservation_id, guest_id, room_id, employee_id, checkin_date, checkout_date) ' +
            'SELECT reservation_id, guest_id, room_id, $1, $2, $3 FROM Reservation WHERE reservation_id = $4';
        await client.query(query, [employee_id, checkin_date, checkout_date, reservation_id]);
        await client.query('UPDATE Reservation SET status = $1 WHERE reservation_id = $2', ['Checked-in', reservation_id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all hotel chains
app.get('/api/hotelChains', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM HotelChain');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Get all hotels
app.get('/api/hotels', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Hotel');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get('/api/hotel-locations', async (req, res) => {
    try {
        const result = await client.query('SELECT address FROM Hotel');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Get all reservations
app.get('/api/reservations', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Reservation');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Get all archives
app.get('/api/archives', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Archived_Records');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


// Create a new hotel chain
app.post('/api/hotelChain', async (req, res) => {
    const { name, central_address, num_hotels, contact_email, telephone } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO HotelChain (name, central_address, num_hotels, contact_email, telephone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, central_address, num_hotels, contact_email, telephone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Update a hotel chain
app.put('/api/hotelChain/:id', async (req, res) => {
    const { id } = req.params;
    const { name, central_address, num_hotels, contact_email, telephone } = req.body;
    try {
        const result = await client.query(
            'UPDATE HotelChain SET name = $1, central_address = $2, num_hotels = $3, contact_email = $4, telephone = $5 WHERE chain_id = $6 RETURNING *',
            [name, central_address, num_hotels, contact_email, telephone, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Delete a hotel chain
app.delete('/api/hotelChain/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await client.query('DELETE FROM HotelChain WHERE chain_id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Archive records (Reservations, Rentals)
app.post('/api/archive', async (req, res) => {
    const { original_id, type, data_snapshot } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [original_id, type, data_snapshot]
        );
        await client.query(
            'DELETE FROM ' + type + ' WHERE ' + (type === 'Reservation' ? 'reservation_id' : 'rental_id') + ' = $1', [original_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Endpoint to get all guests
app.get('/api/guests', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Guest');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.post('/api/guest', async (req, res) => {
    const { full_name, address, sin, date_of_checkin } = req.body;

    if (!full_name || !address || !sin || !date_of_checkin) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sinPattern = /^\d{9}$/;
    if (!sinPattern.test(sin)) {
        return res.status(400).json({ message: 'Invalid SIN format. It should be exactly 9 digits.' });
    }

    try {
        const query = `
        INSERT INTO Guest (full_name, address, sin, date_of_checkin)
        VALUES ($1, $2, $3, $4)
        RETURNING guest_id, full_name, address, sin, date_of_checkin;
      `;
        const values = [full_name, address, sin, date_of_checkin];

        const result = await client.query(query, values);

        const newGuest = result.rows[0];
        res.status(201).json(newGuest);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'A guest with this SIN already exists.' });
        }
        console.error(err);
        res.status(500).json({ message: 'An error occurred while adding the guest.' });
    }
});

app.post('/api/employee', async (req, res) => {
    const { hotel_id, full_name, address, sin, role } = req.body;

    if (!['Manager', 'Receptionist', 'Housekeeper'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Valid roles are Manager, Receptionist, or Housekeeper.' });
    }

    const query = `
      INSERT INTO Employee (hotel_id, full_name, address, sin, role)
      VALUES ($1, $2, $3, $4, $5) RETURNING employee_id;
    `;

    try {
        const result = await client.query(query, [hotel_id, full_name, address, sin, role]);
        const employee_id = result.rows[0].employee_id;

        res.status(201).json({ employee_id });
    } catch (err) {
        console.error('Error inserting new employee:', err);
        res.status(500).json({ error: 'Failed to add new employee' });
    }
});

app.post('/api/room', async (req, res) => {
    const { hotel_id, price, capacity, view, extendable, condition, amenities } = req.body;

    if (![1, 2, 3].includes(capacity)) {
        return res.status(400).json({ error: 'Capacity must be 1, 2, or 3.' });
    }

    if (!['Sea View', 'Mountain View', 'City View'].includes(view)) {
        return res.status(400).json({ error: 'Invalid view type.' });
    }

    if (!['Damaged', 'In Repair', 'Good Condition'].includes(condition)) {
        return res.status(400).json({ error: 'Invalid condition.' });
    }

    const query = `
      INSERT INTO Room (hotel_id, price, capacity, view, extendable, condition, amenities)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING room_id;
    `;

    try {
        const result = await client.query(query, [hotel_id, price, capacity, view, extendable, condition, (amenities || "")]);
        const room_id = result.rows[0].room_id;

        res.status(201).json({ room_id });
    } catch (err) {
        console.error('Error inserting new room:', err);
        res.status(500).json({ error: 'Failed to add new room' });
    }
});

app.post('/api/hotel', async (req, res) => {
    const { chain_id, name, classification, num_rooms, address, contact_email, telephone } = req.body;

    const num_rooms_l = num_rooms || 0;

    if (!chain_id || !name || !classification || !address || !contact_email || !telephone) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (classification < 1 || classification > 5) {
        return res.status(400).json({ error: 'Classification must be between 1 and 5' });
    }

    try {
        const result = await client.query(
            `INSERT INTO Hotel (chain_id, name, classification, num_rooms, address, contact_email, telephone)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [chain_id, name, classification, num_rooms_l, address, contact_email, telephone]
        );

        const newHotel = result.rows[0];
        res.status(201).json(newHotel);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


// Endpoint to get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM Employee');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Endpoint to get all rentals with associated payments
app.get('/api/rentals', async (req, res) => {
    try {
        const result = await client.query(
            `SELECT 
                rental.*, 
                room.price AS totalamount,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'payment_id', payment.payment_id,
                            'amount', payment.amount,
                            'payment_method', payment.payment_method,
                            'payment_date', payment.payment_date
                        )
                    ) FILTER (WHERE payment.payment_id IS NOT NULL), '[]') AS payments
            FROM Rental rental
            JOIN Room room ON room.room_id = rental.room_id
            LEFT JOIN Payment payment ON payment.rental_id = rental.rental_id
            GROUP BY rental.rental_id, room.price;`
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Endpoint to delete from Hotel table
app.delete('/api/hotel/:hotel_id', async (req, res) => {
    const { hotel_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Hotel WHERE hotel_id = $1 RETURNING *', [hotel_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Hotel not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete from Room table
app.delete('/api/room/:room_id', async (req, res) => {
    const { room_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Room WHERE room_id = $1 RETURNING *', [room_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Room not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete from Guest table
app.delete('/api/guest/:guest_id', async (req, res) => {
    const { guest_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Guest WHERE guest_id = $1 RETURNING *', [guest_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Guest not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete from Employee table
app.delete('/api/employee/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Employee WHERE employee_id = $1 RETURNING *', [employee_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Employee not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete from Reservation table
app.delete('/api/reservation/:reservation_id', async (req, res) => {
    const { reservation_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Reservation WHERE reservation_id = $1 RETURNING *', [reservation_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Reservation not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete from Rental table
app.delete('/api/rental/:rental_id', async (req, res) => {
    const { rental_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Rental WHERE rental_id = $1 RETURNING *', [rental_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Rental not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete from Archived_Records table
app.delete('/api/archived-records/:record_id', async (req, res) => {
    const { record_id } = req.params;
    try {
        const result = await client.query('DELETE FROM Archived_Records WHERE record_id = $1 RETURNING *', [record_id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Archived Record not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.get('/api/views/availability', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Both start_date and end_date are required' });
        }

        /* const query = `
            SELECT view, COUNT(*) AS available_rooms
            FROM Room
            WHERE room_id NOT IN (
                SELECT room_id
                FROM Reservation
                WHERE (start_date <= to_TIMESTAMP($1, 'YYYY-MM-DD') AND end_date >= to_TIMESTAMP($2, 'YYYY-MM-DD'))
                OR (start_date <= to_TIMESTAMP($3, 'YYYY-MM-DD') AND end_date >= to_TIMESTAMP($4, 'YYYY-MM-DD'))
            )
            GROUP BY view;
        `; */

        const query = 'SELECT * FROM Available_Rooms_By_Area';

        const result = await client.query(query);

        const availability = result.rows;

        res.json(availability);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/views/capacity', async (req, res) => {
    try {
        const { hotel_id } = req.query;

        if (!hotel_id) {
            return res.status(400).json({ error: 'Hotel ID is required' });
        }

        // Query to get the count of rooms for each capacity in the given hotel
        /* const query = `
            SELECT capacity, COUNT(*) AS count
            FROM Room
            WHERE hotel_id = $1
            GROUP BY capacity
            ORDER BY capacity;
        `; */

        const query = `
            SELECT * FROM Room_Capacity_By_Hotel
            WHERE hotel_id = $1
        `;

        const result = await client.query(query, [hotel_id]);

        const capacityData = result.rows.map(row => ({
            capacity: parseInt(row.capacity),
            count: parseInt(row.count),
        }));

        res.json(capacityData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// NEW -> PUT /api/payment (Create a new payment)
app.put('/api/payment', async (req, res) => {
    const { rental_id, amount, payment_method, payment_date } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO Payment (rental_id, amount, payment_method, payment_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [rental_id, amount, payment_method, payment_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating payment');
    }
});

// GET -> GET /api/payment (Get a specific payment by ID)
app.get('/api/payment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('SELECT * FROM Payment WHERE payment_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Payment not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching payment');
    }
});

// GETALL -> GET /api/payments (Get all payments)
app.get('/api/payments', async (req, res) => {
    try {
        // Modified SQL query with necessary joins
        const query = `
            SELECT 
                payment.*,
                rental.room_id as room_number, 
                guest.full_name AS guest_name
            FROM 
                Payment payment
            JOIN 
                Rental rental ON payment.rental_id = rental.rental_id
            JOIN 
                Guest guest ON rental.guest_id = guest.guest_id
        `;

        // Execute the query and fetch the results
        const result = await client.query(query);

        // Send the result as a JSON response
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching payments');
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        // Query to get all reservations and rentals
        const query = `
        SELECT 
          r.reservation_id AS id,
          h.name AS hotel_name,
          h.address AS location,
          rm.view AS room_type,
          r.start_date AS check_in,
          r.end_date AS check_out,
          r.status AS status,
          g.guest_id AS guest_id,
          COUNT(rm.room_id) AS guests,
          (rm.price * (r.end_date - r.start_date)) AS total
        FROM Reservation r
        JOIN Room rm ON r.room_id = rm.room_id
        JOIN Hotel h ON rm.hotel_id = h.hotel_id
        JOIN Guest g ON r.guest_id = g.guest_id
        GROUP BY r.reservation_id, h.name, h.address, rm.view, rm.price, r.start_date, r.end_date, r.status, g.guest_id
        UNION
        SELECT 
          rt.rental_id AS id,
          h.name AS hotel_name,
          h.address AS location,
          rm.view AS room_type,
          rt.checkin_date AS check_in,
          rt.checkout_date AS check_out,
          'Confirmed' AS status,
          g.guest_id AS guest_id,
          COUNT(rm.room_id) AS guests,
          (rm.price * (rt.checkout_date - rt.checkin_date)) AS total
        FROM Rental rt
        JOIN Reservation r ON rt.reservation_id = r.reservation_id
        JOIN Room rm ON rt.room_id = rm.room_id
        JOIN Hotel h ON rm.hotel_id = h.hotel_id
        JOIN Guest g ON rt.guest_id = g.guest_id
        GROUP BY rt.rental_id, h.name, h.address, rm.view, rm.price, rt.checkin_date, rt.checkout_date, g.guest_id
      `;

        const result = await client.query(query);

        // Format the data according to the Booking interface
        const bookings = result.rows.map(row => ({
            id: row.id.toString(),
            hotelName: row.hotel_name,
            location: row.location,
            roomType: row.room_type,
            checkIn: row.check_in.toISOString().split('T')[0],  // Format as YYYY-MM-DD
            checkOut: row.check_out.toISOString().split('T')[0],  // Format as YYYY-MM-DD
            guests: parseInt(row.guests),
            total: parseFloat(row.total),
            status: row.status === 'Cancelled' ? 'Cancelled' : (row.status === 'Checked-in' ? 'Completed' : 'Confirmed'),
        }));

        res.json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).send('Internal Server Error');
    }
});

// UPDATE -> PUT /api/payment/:id (Update a payment)
app.put('/api/payment/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, payment_method, payment_date } = req.body;
    try {
        const result = await client.query(
            'UPDATE Payment SET amount = $1, payment_method = $2, payment_date = $3 WHERE payment_id = $4 RETURNING *',
            [amount, payment_method, payment_date, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Payment not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating payment');
    }
});

app.delete('/api/payment/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM Payment WHERE payment_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Payment not found');
        }
        res.status(200).send('Payment deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting payment');
    }
});



const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
