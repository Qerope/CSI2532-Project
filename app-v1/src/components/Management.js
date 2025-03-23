import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Modal, TextField, Grid, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tab, Tabs, Select, MenuItem } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Archive as ArchiveIcon, RemoveRedEye as ViewIcon } from '@mui/icons-material';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import APIHelper from '../api/APIHelper';

const api = APIHelper();

function Management() {
    const [activeTab, setActiveTab] = useState(0);
    const [hotelChains, setHotelChains] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [guests, setGuests] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [archivedRecords, setArchivedRecords] = useState([]);
    const [currentHotel, setCurrentHotel] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [currentGuest, setCurrentGuest] = useState(null);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [currentReservation, setCurrentReservation] = useState(null);
    const [currentRental, setCurrentRental] = useState(null);
    const [currentArchivedRecord, setCurrentArchivedRecord] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    const [show, setShow] = useState(false);
    const [currentHotelChain, setCurrentHotelChain] = useState(null);
    const [newHotelChain, setNewHotelChain] = useState({ name: '', central_address: '', num_hotels: 0, contact_email: '', telephone: '' });

    const handleConvertToRental = async ({ reservation_id, employee_id, checkin_date, checkout_date }) => {
        try {
            await api.convertToRental(reservation_id, { employee_id, checkin_date, checkout_date });
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error("Error converting reservation to rental:", error);
        }
    };

    const handleArchive = async ({ original_id, type, data_snapshot }) => {
        try {
            await api.archiveRecord({ original_id, type, data_snapshot });
            fetchData();
        } catch (error) {
            console.error("Error archiving:", error);
        }
    };

    const handleOpenModal = (reservation) => {
        setCurrentReservation(reservation);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedEmployee("");
    };

    const handleConfirmConvert = () => {
        if (currentReservation && selectedEmployee) {
            handleConvertToRental({
                reservation_id: currentReservation.reservation_id,
                guest_id: currentReservation.guest_id,
                room_id: currentReservation.room_id,
                checkin_date: currentReservation.start_date,
                checkout_date: currentReservation.end_date,
                employee_id: selectedEmployee,
            });
            handleCloseModal();
        }
    };

    const handleShowHotel = (hotel) => {
        setCurrentHotel(hotel);
        setOpenEditModal(hotel);
    };

    const handleShowRoom = (room) => {
        setCurrentRoom(room);
        setOpenEditModal(room);
    };

    const handleShowGuest = (guest) => {
        setCurrentGuest(guest);
        setOpenEditModal(guest);
    };

    const handleShowEmployee = (employee) => {
        setCurrentEmployee(employee);
        setOpenEditModal(employee);
    };

    const handleShowReservation = (reservation) => {
        setCurrentReservation(reservation);
        setOpenEditModal(reservation);
    };

    const handleShowRental = (rental) => {
        setCurrentRental(rental);
        setOpenEditModal(rental);
    };

    const handleShowArchivedRecord = (record) => {
        setCurrentArchivedRecord(record);
        setOpenEditModal(record);
    };

    const handleDeleteHotel = async (hotelId) => {
        try {
            console.log(`Deleting hotel with ID: ${hotelId}`);
            const deletedHotel = await api.handleDeleteHotel(hotelId);
            fetchData();
        } catch (error) {
            console.error('Error deleting hotel:', error);
        }
    };
    
    const handleDeleteRoom = async (roomId) => {
        try {
            console.log(`Deleting room with ID: ${roomId}`);
            const deletedRoom = await api.handleDeleteRoom(roomId);
            fetchData();
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };
    
    const handleDeleteGuest = async (guestId) => {
        try {
            console.log(`Deleting guest with ID: ${guestId}`);
            const deletedGuest = await api.handleDeleteGuest(guestId);
            fetchData();
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };
    
    const handleDeleteEmployee = async (employeeId) => {
        try {
            console.log(`Deleting employee with ID: ${employeeId}`);
            const deletedEmployee = await api.handleDeleteEmployee(employeeId);
            fetchData();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };
    
    const handleDeleteReservation = async (reservationId) => {
        try {
            console.log(`Deleting reservation with ID: ${reservationId}`);
            const deletedReservation = await api.handleDeleteReservation(reservationId);
            fetchData();
        } catch (error) {
            console.error('Error deleting reservation:', error);
        }
    };
    
    const handleDeleteRental = async (rentalId) => {
        try {
            console.log(`Deleting rental with ID: ${rentalId}`);
            const deletedRental = await api.handleDeleteRental(rentalId);
            fetchData();
        } catch (error) {
            console.error('Error deleting rental:', error);
        }
    };
    
    const handleDeleteArchivedRecord = async (recordId) => {
        try {
            console.log(`Deleting archived record with ID: ${recordId}`);
            const deletedRecord = await api.handleDeleteArchivedRecord(recordId);
            fetchData();
        } catch (error) {
            console.error('Error deleting archived record:', error);
        }
    };    

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        api.fetchChains()
            .then(response => setHotelChains(response))
            .catch(err => console.error(err));
        api.fetchHotels()
            .then(response => setHotels(response))
            .catch(err => console.error(err));
        api.fetchRooms()
            .then(response => setRooms(response))
            .catch(err => console.error(err));
        api.fetchGuests()
            .then(response => setGuests(response))
            .catch(err => console.error(err));
        api.fetchEmployees()
            .then(response => setEmployees(response))
            .catch(err => console.error(err));
        api.fetchReservations()
            .then(response => setReservations(response))
            .catch(err => console.error(err));
        api.fetchRentals()
            .then(response => setRentals(response))
            .catch(err => console.error(err));
        api.fetchArchivedRecords()
            .then(response => setArchivedRecords(response))
            .catch(err => console.error(err));
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleCreateHotelChain = () => {
        api.handleCreateHotelChain(newHotelChain)
            .then(response => {
                setHotelChains([...hotelChains, response.data]);
                setShow(false);
            })
            .catch(err => console.error(err));
    };

    const handleEditHotelChain = (id) => {
        api.handleEditHotelChain(id, currentHotelChain)
            .then(response => {
                const updatedHotelChains = hotelChains.map(chain =>
                    chain.chain_id === id ? response.data : chain
                );
                setHotelChains(updatedHotelChains);
                setShow(false);
            })
            .catch(err => console.error(err));
    };

    const handleDeleteHotelChain = (id) => {
        api.handleDeleteHotelChain(id)
            .then(() => {
                setHotelChains(hotelChains.filter(chain => chain.chain_id !== id));
            })
            .catch(err => console.error(err));
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Hotel Management
            </Typography>
            {/* Tabs for each table */}
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="Hotel Management Tabs" sx={{ marginBottom: 3 }}>
                <Tab label="Hotel Chains" />
                <Tab label="Hotels" />
                <Tab label="Rooms" />
                <Tab label="Guests" />
                <Tab label="Employees" />
                <Tab label="Reservations" />
                <Tab label="Rentals" />
                <Tab label="Archived Records" />
            </Tabs>

            {/* Content for Hotel Chains */}
            {activeTab === 0 && (
                <Box>
                    <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShow} sx={{ marginBottom: 3 }}>
                        Create New Hotel Chain
                    </Button>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="hotel chain table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Chain ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Central Address</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hotelChains.map((chain) => (
                                    <TableRow key={chain.chain_id}>
                                        <TableCell>{chain.chain_id}</TableCell>
                                        <TableCell>{chain.name}</TableCell>
                                        <TableCell>{chain.central_address}</TableCell>
                                        <TableCell>{chain.contact_email}</TableCell>
                                        <TableCell>{chain.telephone}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<EditIcon />}
                                                onClick={() => {
                                                    setCurrentHotelChain(chain);
                                                    handleShow();
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteHotelChain(chain.chain_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Content for Hotels */}
            {activeTab === 1 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowHotel} sx={{ marginBottom: 3 }}>
                        Create New Hotel
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="hotel table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Hotel ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Chain</TableCell>
                                    <TableCell>Classification</TableCell>
                                    <TableCell>Rooms</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hotels.map((hotel) => (
                                    <TableRow key={hotel.hotel_id}>
                                        <TableCell>{hotel.hotel_id}</TableCell>
                                        <TableCell>{hotel.name}</TableCell>
                                        <TableCell>{hotel.chain_id}</TableCell>
                                        <TableCell>{hotel.classification}</TableCell>
                                        <TableCell>{hotel.num_rooms}</TableCell>
                                        <TableCell>{hotel.address}</TableCell>
                                        <TableCell>{hotel.contact_email}</TableCell>
                                        <TableCell>{hotel.telephone}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowHotel(hotel);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteHotel(hotel.hotel_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Content for Rooms */}
            {activeTab === 2 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowRoom} sx={{ marginBottom: 3 }}>
                        Create New Room
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="room table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Room ID</TableCell>
                                    <TableCell>Hotel ID</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Capacity</TableCell>
                                    <TableCell>View</TableCell>
                                    <TableCell>Condition</TableCell>
                                    <TableCell>Amenities</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rooms.map((room) => (
                                    <TableRow key={room.room_id}>
                                        <TableCell>{room.room_id}</TableCell>
                                        <TableCell>{room.hotel_id}</TableCell>
                                        <TableCell>{room.price}</TableCell>
                                        <TableCell>{room.capacity}</TableCell>
                                        <TableCell>{room.view}</TableCell>
                                        <TableCell>{room.condition}</TableCell>
                                        <TableCell>{room.amenities}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowRoom(room);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteRoom(room.room_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Content for Guests */}
            {activeTab === 3 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowGuest} sx={{ marginBottom: 3 }}>
                        Create New Guest
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="guest table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Guest ID</TableCell>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>SIN</TableCell>
                                    <TableCell>Date of Check-In</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {guests.map((guest) => (
                                    <TableRow key={guest.guest_id}>
                                        <TableCell>{guest.guest_id}</TableCell>
                                        <TableCell>{guest.full_name}</TableCell>
                                        <TableCell>{guest.address}</TableCell>
                                        <TableCell>{guest.SIN}</TableCell>
                                        <TableCell>{guest.date_of_checkin}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowGuest(guest);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteGuest(guest.guest_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Content for Employees */}
            {activeTab === 4 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowEmployee} sx={{ marginBottom: 3 }}>
                        Create New Employee
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="employee table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee ID</TableCell>
                                    <TableCell>Full Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>SIN</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((employee) => (
                                    <TableRow key={employee.employee_id}>
                                        <TableCell>{employee.employee_id}</TableCell>
                                        <TableCell>{employee.full_name}</TableCell>
                                        <TableCell>{employee.address}</TableCell>
                                        <TableCell>{employee.SIN}</TableCell>
                                        <TableCell>{employee.role}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowEmployee(employee);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteEmployee(employee.employee_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Content for Reservations */}
            {activeTab === 5 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowReservation} sx={{ marginBottom: 3 }}>
                        Create New Reservation
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="reservation table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Reservation ID</TableCell>
                                    <TableCell>Guest ID</TableCell>
                                    <TableCell>Room ID</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.map((reservation) => (
                                    <TableRow key={reservation.reservation_id}>
                                        <TableCell>{reservation.reservation_id}</TableCell>
                                        <TableCell>{reservation.guest_id}</TableCell>
                                        <TableCell>{reservation.room_id}</TableCell>
                                        <TableCell>{reservation.start_date}</TableCell>
                                        <TableCell>{reservation.end_date}</TableCell>
                                        <TableCell>{reservation.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowReservation(reservation);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteReservation(reservation.reservation_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="success"
                                                startIcon={<AssignmentTurnedInIcon />}
                                                onClick={() => handleOpenModal(reservation)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Convert to Rental
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ArchiveIcon />}
                                                onClick={() => handleArchive({ original_id: reservation.reservation_id, type: "Reservation", data_snapshot: reservation })}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Archive
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
                    <Typography variant="h6">Convert Reservation to Rental</Typography>
                    <Typography sx={{ mt: 2 }}>Select Employee Responsible:</Typography>
                    <Select
                        fullWidth
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        sx={{ mt: 1 }}
                    >
                        {employees.map((employee) => (
                            <MenuItem key={employee.employee_id} value={employee.employee_id}>
                                {employee.full_name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button variant="contained" color="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleConfirmConvert} disabled={!selectedEmployee}>
                            Confirm
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={openEditModal} onClose={() => { setOpenEditModal(null); }}>
                <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
                    <Typography variant="h6">View</Typography>
                    <form>
                        {Object.keys(openEditModal || {}).map((field) => (
                            <TextField
                                key={field}
                                label={field}
                                value={openEditModal[field] || ''}
                                onChange={(e) => {}}
                                fullWidth
                                margin="normal"
                            />
                        ))}
                        {/* <Button
                            variant="contained"
                            onClick={() => {
                                
                            }}
                            sx={{ mt: 2 }}
                        >
                            Save Changes
                        </Button> */}
                    </form>
                </Box>
            </Modal>

            {/* Content for Rentals */}
            {activeTab === 6 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowRental} sx={{ marginBottom: 3 }}>
                        Create New Rental
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="rental table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rental ID</TableCell>
                                    <TableCell>Reservation ID</TableCell>
                                    <TableCell>Guest ID</TableCell>
                                    <TableCell>Room ID</TableCell>
                                    <TableCell>Employee ID</TableCell>
                                    <TableCell>Check-In Date</TableCell>
                                    <TableCell>Checkout Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rentals.map((rental) => (
                                    <TableRow key={rental.rental_id}>
                                        <TableCell>{rental.rental_id}</TableCell>
                                        <TableCell>{rental.reservation_id}</TableCell>
                                        <TableCell>{rental.guest_id}</TableCell>
                                        <TableCell>{rental.room_id}</TableCell>
                                        <TableCell>{rental.employee_id}</TableCell>
                                        <TableCell>{rental.checkin_date}</TableCell>
                                        <TableCell>{rental.checkout_date}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowRental(rental);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteRental(rental.rental_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ArchiveIcon />}
                                                onClick={() => handleArchive({ original_id: rental.rental_id, type: "Rental", data_snapshot: rental })}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Archive
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Content for Archived Records */}
            {activeTab === 7 && (
                <Box>
                    {/* <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleShowArchivedRecord} sx={{ marginBottom: 3 }}>
                        Create New Archived Record
                    </Button> */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="archived record table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Record ID</TableCell>
                                    <TableCell>Original ID</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Archived At</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {archivedRecords.map((record) => (
                                    <TableRow key={record.record_id}>
                                        <TableCell>{record.record_id}</TableCell>
                                        <TableCell>{record.original_id}</TableCell>
                                        <TableCell>{record.type}</TableCell>
                                        <TableCell>{record.archived_at}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    handleShowArchivedRecord(record);
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteArchivedRecord(record.record_id)}
                                                sx={{ marginLeft: 1 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}


            {/* Modal for creating or editing a Hotel Chain */}
            <Modal open={show} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                        width: { xs: '90%', sm: 500 },
                    }}
                >
                    <Typography variant="h6" mb={2}>{currentHotelChain ? 'Edit' : 'Create'} Hotel Chain</Typography>
                    <TextField
                        label="Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        defaultValue={currentHotelChain ? currentHotelChain.name : ''}
                        onChange={(e) => setCurrentHotelChain({ ...currentHotelChain, name: e.target.value })}
                    />
                    <TextField
                        label="Central Address"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        defaultValue={currentHotelChain ? currentHotelChain.central_address : ''}
                        onChange={(e) => setCurrentHotelChain({ ...currentHotelChain, central_address: e.target.value })}
                    />
                    <TextField
                        label="Number of Hotels"
                        type="number"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        defaultValue={currentHotelChain ? currentHotelChain.num_hotels : ''}
                        onChange={(e) => setCurrentHotelChain({ ...currentHotelChain, num_hotels: e.target.value })}
                    />
                    <TextField
                        label="Contact Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        defaultValue={currentHotelChain ? currentHotelChain.contact_email : ''}
                        onChange={(e) => setCurrentHotelChain({ ...currentHotelChain, contact_email: e.target.value })}
                    />
                    <TextField
                        label="Telephone"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        defaultValue={currentHotelChain ? currentHotelChain.telephone : ''}
                        onChange={(e) => setCurrentHotelChain({ ...currentHotelChain, telephone: e.target.value })}
                    />

                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={currentHotelChain ? () => handleEditHotelChain(currentHotelChain.chain_id) : handleCreateHotelChain}
                        >
                            {currentHotelChain ? 'Update' : 'Create'} Chain
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default Management;
