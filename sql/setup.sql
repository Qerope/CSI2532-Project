-- Creating tables
CREATE TABLE HotelChain (
    chain_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    central_address VARCHAR(255) NOT NULL,
    num_hotels INTEGER NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL
);

CREATE TABLE Hotel (
    hotel_id SERIAL PRIMARY KEY,
    chain_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    classification INTEGER NOT NULL CHECK (classification BETWEEN 1 AND 5),
    num_rooms INTEGER NOT NULL,
    address VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    FOREIGN KEY (chain_id) REFERENCES HotelChain(chain_id) ON DELETE CASCADE
);

CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    capacity INTEGER NOT NULL CHECK (capacity IN (1, 2, 3)),
    view VARCHAR(50) NOT NULL CHECK (view IN ('Sea View', 'Mountain View', 'City View')),
    extendable BOOLEAN NOT NULL,
    condition VARCHAR(50) NOT NULL CHECK (condition IN ('Damaged', 'In Repair', 'Good Condition')),
    amenities TEXT NOT NULL,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);

CREATE TABLE Guest (
    guest_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    SIN VARCHAR(20) NOT NULL UNIQUE CHECK (SIN ~ '^\d{9}$'),
    date_of_checkin DATE NOT NULL
);

CREATE TABLE Employee (
    employee_id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    SIN VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL CHECK (role IN ('Manager', 'Receptionist', 'Housekeeper')),
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);

CREATE TABLE Reservation (
    reservation_id SERIAL PRIMARY KEY,
    guest_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Booked', 'Checked-in', 'Cancelled')),
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

CREATE TABLE Rental (
    rental_id SERIAL PRIMARY KEY,
    reservation_id INTEGER NOT NULL,
    guest_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES Guest(guest_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Archived_Records (
    record_id SERIAL PRIMARY KEY,
    original_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Reservation', 'Rental')),
    data_snapshot TEXT NOT NULL,
    archived_at TIMESTAMP NOT NULL
);

CREATE TABLE Payment (
    payment_id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('Credit Card', 'Debit Card', 'Cash', 'Bank Transfer')),
    payment_date TIMESTAMP NOT NULL,
    FOREIGN KEY (rental_id) REFERENCES Rental(rental_id) ON DELETE CASCADE
);
