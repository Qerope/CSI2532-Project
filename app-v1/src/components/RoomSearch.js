import React, { useState, useEffect } from 'react';
import APIHelper from '../api/APIHelper';
import {
    Button,
    TextField,
    Typography,
    Box,
    InputAdornment,
    Select,
    MenuItem,
    Slider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    IconButton,
    Grid,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import {
    Search as SearchIcon,
    Hotel as HotelIcon,
    Person as PersonIcon,
    AcUnit,
    Tv,
    Wifi,
    LocalBar,
    HotTub,
    Bathtub,
    Pool,
    Balcony,
    Dangerous,
    Handyman,
    Check,
    Landscape,
    Tsunami,
    LocationCity,
    Menu as MenuIcon
} from '@mui/icons-material';


const api = APIHelper();
const iconMap = {
    "AC": <AcUnit />,
    "Air-Conditioning": <AcUnit />,
    "TV": <Tv />,
    "Wi-Fi": <Wifi />,
    "Mini Bar": <LocalBar />,
    "Mini-Bar": <LocalBar />,
    "Jacuzzi": <HotTub />,
    "Bathtub": <Bathtub />,
    "Private Pool": <Pool />,
    "Balcony": <Balcony />,
    "Good Condition": <Check />,
    "Damaged": <Dangerous />,
    "In Repair": <Handyman />,
    "Sea View": <Landscape />,
    "Mountain View": <Tsunami />,
    "City View": <LocationCity />
};

const RoomSearch = () => {
    const [rooms, setRooms] = useState([]);
    const [hotels, setHotels] = useState({});
    const [hotelChains, setHotelChains] = useState([]);
    const [guests, setGuests] = useState([]);
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        capacity: 1,
        price: 9000,
        hotel_chain: ''
    });
    const [bookingModal, setBookingModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [guestId, setGuestId] = useState('');
    const [selectedChain, setSelectedChain] = useState('');
    const [maxPrice, setMaxPrice] = useState(9000);
    const [drawerOpen, setDrawerOpen] = useState(true);

    useEffect(() => {
        api.fetchChains()
            .then(response => setHotelChains(response))
            .catch(err => console.error(err));
        api.fetchGuests()
            .then(response => setGuests(response))
            .catch(err => console.error(err));

        const fetchHotels = async () => {
            const hotelData = await api.fetchHotels();
            const hotelMap = hotelData.reduce((acc, hotel) => {
                acc[hotel.hotel_id] = hotel;
                return acc;
            }, {});
            setHotels(hotelMap);
        };

        fetchHotels();
        handleSearch();
    }, []);

    const handleSearch = async () => {
        const fetchedRooms = await api.fetchRooms(filters);
        if (fetchedRooms.length > 1 && filters.price == 9000) {
            let maxP = fetchedRooms.reduce((a, b) => a.price > b.price ? a : b).price;
            setMaxPrice(maxP);
            setFilters({ ...filters, price: maxP });
        }
        setRooms(fetchedRooms);
    };

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        if (e.target.name === 'hotel_chain') {
            setSelectedChain(e.target.value);
            handleSearch();
        }
    };

    const handleBookNow = (room) => {
        setSelectedRoom(room);
        setBookingModal(true);
    };

    const handleReservation = async () => {
        if (selectedRoom && guestId) {
            await api.makeReservation({ guest_id: guestId, room_id: selectedRoom.room_id, start_date: filters.start_date, end_date: filters.end_date });
            setBookingModal(false);
            alert('Reservation successful!');
        }
    };

    const handleToggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (

        <Box sx={{ display: 'flex', padding: 4, backgroundColor: 'white' }}>
            {/* Sidebar Drawer */}
            <Drawer
                sx={{
                    width: 300,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 300,
                        boxSizing: 'border-box',
                        padding: 2,
                        backgroundColor: '#f4f4f400',
                        paddingTop: '20px',
                        maxHeight: '100%'
                    },
                }}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
            >

                <Typography variant="h6" color="primary" gutterBottom>
                    Filters
                </Typography>

                {/* Start Date */}
                <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    name="start_date"
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ marginBottom: 2 }}
                />

                {/* End Date */}
                <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    name="end_date"
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ marginBottom: 2 }}
                />

                {/* Capacity */}
                <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    name="capacity"
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon color="primary" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ marginBottom: 2 }}
                />

                {/* Max Price */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 1 }}>
                    Max Price
                </Typography>
                <Slider
                    value={filters.price}
                    onChange={handleChange}
                    name="price"
                    marks
                    min={0}
                    max={maxPrice}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => `$${value}`}
                    sx={{
                        '& .MuiSlider-rail': {
                            backgroundColor: '#ddd',
                        },
                        '& .MuiSlider-thumb': {
                            backgroundColor: '#3f51b5',
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: '#3f51b5',
                        },
                    }}
                    sx={{ marginBottom: 2 }}
                />

                {/* Hotel Chain Select */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 1 }}>
                    Hotel Chain
                </Typography>
                <Select
                    fullWidth
                    value={selectedChain}
                    name="hotel_chain"
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ marginBottom: 2 }}
                >
                    {hotelChains.map((chain) => (
                        <MenuItem key={chain.chain_id} value={chain.chain_id}>
                            {chain.name}
                        </MenuItem>
                    ))}
                </Select>

                {/* Search Button */}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{ marginTop: 2 }}
                >
                    Search
                </Button>
            </Drawer>

            {/* Main Content */}
            <Box sx={{}}>
                <Grid container spacing={3}>
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <Grid item xs={12} sm={4} md={3} key={room.room_id}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', padding: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6" color="primary" fontWeight="bold">
                                            {hotels[room.hotel_id]?.name || 'Unknown Hotel'}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            {hotels[room.hotel_id]?.address || 'Unknown Address'}
                                        </Typography>
                                        <Typography variant="h5" color="primary" sx={{ marginBottom: 2 }}>
                                            ${room.price}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                                            Capacity: {room.capacity}
                                        </Typography>

                                        {/* View & Condition */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Typography variant="body2">View:</Typography>
                                                {iconMap[room.view] || room.view}
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Typography variant="body2">Condition:</Typography>
                                                {iconMap[room.condition] || room.condition}
                                            </Box>
                                        </Box>

                                        {/* Amenities */}
                                        <Typography variant="body2" fontWeight="bold" gutterBottom>Amenities:</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {room.amenities.split(', ').map((amenity, index) => (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    {iconMap[amenity] || amenity}
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>

                                    {/* Action Button */}
                                    <CardActions sx={{ justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleBookNow(room)}
                                        >
                                            Book Now
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="h6" align="center" color="textSecondary" sx={{ width: '100%' }}>
                            No rooms found. Please adjust your search filters.
                        </Typography>
                    )}
                </Grid>
            </Box>

            {/* Booking Modal */}
            <Dialog open={bookingModal} onClose={() => setBookingModal(false)}>
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={guestId}
                        label="Guest ID"
                        name="guest_id"
                        onChange={(e) => setGuestId(e.target.value)}
                        variant="outlined"
                        margin="dense"
                    >
                        {guests.map((guest) => (
                            <MenuItem key={guest.guest_id} value={guest.guest_id}>
                                {guest.full_name}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        name="start_date"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        name="end_date"
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBookingModal(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleReservation}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default RoomSearch;
