-- Query 1: Find all available rooms for a specific date range and location
SELECT r.room_id, h.name AS hotel_name, h.classification, r.price, r.capacity, r.view, r.amenities
FROM Room r
JOIN Hotel h ON r.hotel_id = h.hotel_id
WHERE h.address LIKE '%New York%'
AND r.room_id NOT IN (
    SELECT res.room_id
    FROM Reservation res
    WHERE res.status = 'Booked'
    AND (
        ('2024-06-15' BETWEEN res.start_date AND res.end_date) OR
        ('2024-06-20' BETWEEN res.start_date AND res.end_date) OR
        (res.start_date BETWEEN '2024-06-15' AND '2024-06-20') OR
        (res.end_date BETWEEN '2024-06-15' AND '2024-06-20')
    )
);

-- Query 2: Get all hotels in a specific chain with their room counts and classifications
SELECT h.hotel_id, h.name, h.address, h.classification, h.num_rooms, 
       COUNT(r.room_id) AS actual_room_count
FROM Hotel h
JOIN HotelChain hc ON h.chain_id = hc.chain_id
LEFT JOIN Room r ON h.hotel_id = r.hotel_id
WHERE hc.name = 'Marriott International'
GROUP BY h.hotel_id, h.name, h.address, h.classification, h.num_rooms
ORDER BY h.classification DESC, actual_room_count DESC;

-- Query 3: Find guests with upcoming reservations and their booking details
SELECT g.guest_id, g.full_name, g.address, res.reservation_id, 
       res.start_date, res.end_date, h.name AS hotel_name, r.room_id
FROM Guest g
JOIN Reservation res ON g.guest_id = res.guest_id
JOIN Room r ON res.room_id = r.room_id
JOIN Hotel h ON r.hotel_id = h.hotel_id
WHERE res.status = 'Booked'
AND res.start_date >= CURRENT_DATE
ORDER BY res.start_date;

-- Query 4: Get a summary of room types and their average prices by hotel chain
SELECT hc.name AS chain_name, h.classification,
       r.capacity, COUNT(r.room_id) AS room_count,
       AVG(r.price) AS avg_price, MIN(r.price) AS min_price, MAX(r.price) AS max_price
FROM Room r
JOIN Hotel h ON r.hotel_id = h.hotel_id
JOIN HotelChain hc ON h.chain_id = hc.chain_id
GROUP BY hc.name, h.classification, r.capacity
ORDER BY hc.name, h.classification DESC, r.capacity;

-- Trigger 1: Archive reservation data when a reservation is deleted
CREATE OR REPLACE FUNCTION archive_reservation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at)
    VALUES (
        OLD.reservation_id,
        'Reservation',
        json_build_object(
            'reservation_id', OLD.reservation_id,
            'guest_id', OLD.guest_id,
            'room_id', OLD.room_id,
            'start_date', OLD.start_date,
            'end_date', OLD.end_date,
            'status', OLD.status
        )::text,
        CURRENT_TIMESTAMP
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservation_archive_trigger
BEFORE DELETE ON Reservation
FOR EACH ROW
EXECUTE FUNCTION archive_reservation();

-- Trigger 2: Archive rental data when a rental is deleted
CREATE OR REPLACE FUNCTION archive_rental()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at)
    VALUES (
        OLD.rental_id,
        'Rental',
        json_build_object(
            'rental_id', OLD.rental_id,
            'reservation_id', OLD.reservation_id,
            'guest_id', OLD.guest_id,
            'room_id', OLD.room_id,
            'employee_id', OLD.employee_id,
            'checkin_date', OLD.checkin_date,
            'checkout_date', OLD.checkout_date
        )::text,
        CURRENT_TIMESTAMP
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rental_archive_trigger
BEFORE DELETE ON Rental
FOR EACH ROW
EXECUTE FUNCTION archive_rental();

-- View 1: Number of available rooms by area
CREATE VIEW available_rooms_by_area AS
SELECT 
  SUBSTRING(h.address FROM '([^,]+, [A-Z]{2})') AS area,
  COUNT(r.room_id) AS available_rooms
FROM Room r
JOIN Hotel h ON r.hotel_id = h.hotel_id
LEFT JOIN Reservation res ON r.room_id = res.room_id 
  AND res.status = 'Booked' 
  AND CURRENT_DATE BETWEEN res.start_date AND res.end_date
WHERE res.reservation_id IS NULL
GROUP BY area
ORDER BY available_rooms DESC;

-- View 2: Capacity of all rooms in a specific hotel
CREATE VIEW room_capacity_by_hotel AS
SELECT 
  h.hotel_id,
  h.name AS hotel_name,
  hc.name AS chain_name,
  h.classification,
  h.address,
  COUNT(r.room_id) AS total_rooms,
  SUM(CASE WHEN r.capacity = 1 THEN 1 ELSE 0 END) AS single_rooms,
  SUM(CASE WHEN r.capacity = 2 THEN 1 ELSE 0 END) AS double_rooms,
  SUM(CASE WHEN r.capacity = 3 THEN 1 ELSE 0 END) AS triple_rooms,
  SUM(r.capacity) AS total_capacity
FROM Hotel h
JOIN HotelChain hc ON h.chain_id = hc.chain_id
JOIN Room r ON h.hotel_id = r.hotel_id
GROUP BY h.hotel_id, h.name, hc.name, h.classification, h.address
ORDER BY h.name;

