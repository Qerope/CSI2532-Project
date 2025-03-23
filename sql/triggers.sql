-- Triggers:
-- Archive a Reservation When Deleted
CREATE OR REPLACE FUNCTION archive_reservation_on_delete() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at)
    VALUES (OLD.reservation_id, 'Reservation', 
           ROW(OLD.guest_id, OLD.room_id, OLD.start_date, OLD.end_date, OLD.status)::TEXT, NOW());
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_archive_reservation_on_delete
AFTER DELETE ON Reservation
FOR EACH ROW
EXECUTE FUNCTION archive_reservation_on_delete();

-- Archive a Rental When Deleted
CREATE OR REPLACE FUNCTION archive_rental_on_delete() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at)
    VALUES (OLD.rental_id, 'Rental', 
           ROW(OLD.reservation_id, OLD.guest_id, OLD.room_id, OLD.employee_id, OLD.checkin_date, OLD.checkout_date)::TEXT, NOW());
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_archive_rental_on_delete
AFTER DELETE ON Rental
FOR EACH ROW
EXECUTE FUNCTION archive_rental_on_delete();

-- Prevent Deletion of Hotel Chain If Hotels Exist
CREATE OR REPLACE FUNCTION prevent_delete_hotel_chain() 
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM Hotel WHERE chain_id = OLD.chain_id) THEN
        RAISE EXCEPTION 'Cannot delete hotel chain with associated hotels.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_delete_hotel_chain
BEFORE DELETE ON HotelChain
FOR EACH ROW
EXECUTE FUNCTION prevent_delete_hotel_chain();

-- Archive a Hotel When Deleted
CREATE OR REPLACE FUNCTION archive_hotel_on_delete() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at)
    VALUES (OLD.hotel_id, 'Hotel', 
           ROW(OLD.chain_id, OLD.name, OLD.classification, OLD.num_rooms, OLD.address, OLD.contact_email, OLD.telephone)::TEXT, NOW());
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_archive_hotel_on_delete
AFTER DELETE ON Hotel
FOR EACH ROW
EXECUTE FUNCTION archive_hotel_on_delete();

-- Archive a Room When Deleted
CREATE OR REPLACE FUNCTION archive_room_on_delete() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO Archived_Records (original_id, type, data_snapshot, archived_at)
    VALUES (OLD.room_id, 'Room', 
           ROW(OLD.hotel_id, OLD.price, OLD.capacity, OLD.view, OLD.extendable, OLD.condition, OLD.amenities)::TEXT, NOW());
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_archive_room_on_delete
AFTER DELETE ON Room
FOR EACH ROW
EXECUTE FUNCTION archive_room_on_delete();

