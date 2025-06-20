import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
});

const apiService = {
    getAllServices : async () => {
        try{
            const response = await apiClient.get('/services');
            return response.data.data;
        }catch (error){
            console.error("Error fetching services", error);
            throw error.response?.data || error;
        }
    },

    getAllSite: async () => {
        try{
            const response = await apiClient.get('/site');
            return response.data.data;
        }catch (error){
            console.error("error fetching sites", error)
            throw error.response?.data || error;
        }
    },

    getBarbersBySite: async (siteId) => {
        try{
            const response = await apiClient.get(`/site/${siteId}/barbers`);
            return response.data.data;
        }catch (error){
            console.error("errror fetching barbers and site")
            throw error.response?.data || error;
        }
    },

    getAvailableSlotsForBooking: async (barberId, date) => {
        try{
            const response = await apiClient.get(`/appointments/bookingslots?barberId=${barberId}&date=${date}`);
            return response.data.data
        }catch (error) {
            console.error("errror fetching available slot for booking")
            throw error.response?.data || error;
        }
    },

    createAppointment: async (bookingData) => {
        try{
            const response = await apiClient.post('/appointments', bookingData);
            return response.data.data
        }catch (error){
            console.error("Error creating appointment:", error);
            throw error.response?.data || error;
        }
    },

    getAppointmentByDetails: async (details) => {
      // details será un objeto como { confirmationCode, clientIdentifier, identifierType }
      try {
        // Tu controlador espera un POST, así que usamos apiClient.post
        // La ruta podría ser '/appointments/confirmation' o similar, ajústala si es necesario.
        const response = await apiClient.post(
          "/appointments/lookup",
          details
        );
        return response.data.data;
      } catch (error) {
        console.error("Error fetching appointment by details:", error);
        // Lanzamos el mensaje de error que viene del backend, que es muy descriptivo.
        throw new Error(
          error.response?.data?.message || "Error al buscar la reserva."
        );
      }
    },
};

export default apiService;