import axios from 'axios';

const API_URL = 'http://localhost:5010/api';

const APIHelper = () => {
    const fetchChains = async (filters) => {
        const response = await axios.get(`${API_URL}/hotelChains`, { params: filters });
        return response.data;
    };

    const fetchHotels = async (filters) => {
        const response = await axios.get(`${API_URL}/hotels`, { params: filters });
        return response.data;
    };

    const fetchRooms = async (filters) => {
        const response = await axios.get(`${API_URL}/rooms`, { params: filters });
        return response.data;
    };

    const fetchGuests = async (filters) => {
        const response = await axios.get(`${API_URL}/guests`, { params: filters });
        return response.data;
    };

    const fetchEmployees = async (filters) => {
        const response = await axios.get(`${API_URL}/employees`, { params: filters });
        return response.data;
    };

    const fetchReservations = async (filters) => {
        const response = await axios.get(`${API_URL}/reservations`, { params: filters });
        return response.data;
    };

    const fetchRentals = async (filters) => {
        const response = await axios.get(`${API_URL}/rentals`, { params: filters });
        return response.data;
    };

    const fetchArchivedRecords = async (filters) => {
        const response = await axios.get(`${API_URL}/archives`, { params: filters } );
        return response.data;
    };

    const makeReservation = async (reservation) => {
        const response = await axios.post(`${API_URL}/reservation`, reservation);
        return response.data;
    };

    const convertToRental = async (reservationId, rentalInfo) => {
        const response = await axios.put(`${API_URL}/rental/${reservationId}`, rentalInfo);
        return response.data;
    };

    const archiveRecord = async (archiveData) => {
        const response = await axios.post(`${API_URL}/archive`, archiveData);
        return response.data;
    };

    const handleCreateHotelChain = async (newHotelChain) => {
        const response = await axios.post(`${API_URL}/hotelChains`, newHotelChain);
        return response.data;
    };

    const handleEditHotelChain = async (id, currentHotelChain) => {
        const response = await axios.put(`${API_URL}/hotelChains/${id}`, currentHotelChain);
        return response.data;
    };

    const handleDeleteHotelChain = async (id) => {
        await axios.delete(`${API_URL}/hotelChains/${id}`);
        return true;
    };

    const handleDeleteHotel = async (id) => {
        const response = await axios.delete(`${API_URL}/hotel/${id}`);
        return response.data;
    };
    
    const handleDeleteRoom = async (id) => {
        const response = await axios.delete(`${API_URL}/room/${id}`);
        return response.data;
    };

    const handleDeleteGuest = async (id) => {
        const response = await axios.delete(`${API_URL}/guest/${id}`);
        return response.data;
    };

    const handleDeleteEmployee = async (id) => {
        const response = await axios.delete(`${API_URL}/employee/${id}`);
        return response.data;
    };

    const handleDeleteReservation = async (id) => {
        const response = await axios.delete(`${API_URL}/reservation/${id}`);
        return response.data;
    };

    const handleDeleteRental = async (id) => {
        const response = await axios.delete(`${API_URL}/rental/${id}`);
        return response.data;
    };

    const handleDeleteArchivedRecord = async (id) => {
        const response = await axios.delete(`${API_URL}/archived-records/${id}`);
        return response.data;
    };

    return {
        fetchChains,
        fetchHotels,
        fetchRooms,
        fetchGuests,
        fetchEmployees,
        fetchReservations,
        fetchRentals,
        fetchArchivedRecords,
        makeReservation,
        convertToRental,
        archiveRecord,
        handleCreateHotelChain,
        handleEditHotelChain,
        handleDeleteHotelChain,
        handleDeleteHotel,
        handleDeleteArchivedRecord,
        handleDeleteEmployee,
        handleDeleteGuest,
        handleDeleteRental,
        handleDeleteReservation,
        handleDeleteRoom
    };
};

export default APIHelper;
