-- Views:
CREATE VIEW Available_Rooms_By_Area AS
SELECT h.address AS hotel_address, COUNT(r.room_id) AS available_rooms
FROM Hotel h
JOIN Room r ON h.hotel_id = r.hotel_id
WHERE r.condition = 'Good Condition'
GROUP BY h.address;

CREATE VIEW Room_Capacity_By_Hotel AS
SELECT hotel_id, capacity, COUNT(*) AS count
FROM Room
GROUP BY hotel_id, capacity
ORDER BY hotel_id, capacity;