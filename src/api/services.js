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
          // 1. Loguear el error técnico completo para nosotros (los devs)
          console.error("Error técnico al obtener servicios:", error);

          // 2. Crear un mensaje de error amigable y estandarizado para la UI
          let userFriendlyMessage = "Ocurrió un problema inesperado.";

          if (error.response) {
            // El servidor respondió con un error
            userFriendlyMessage =
              error.response.data.message ||
              `Error del servidor: ${error.response.status}`;
          } else if (error.request) {
            // No hubo respuesta (error de red)
            userFriendlyMessage =
              "No se pudo conectar al servidor. Inténtalo de nuevo.";
          }

          // 3. Lanzar un NUEVO error que contenga solo el mensaje limpio
          throw new Error(userFriendlyMessage);
        }
    },

    getAllSite: async () => {
        try{
            const response = await apiClient.get('/site');
            return response.data.data;
        }catch (error){
          console.error("Error técnico al obtener las sedes:", error);

          let userFriendlyMessage = "Ocurrió un problema inesperado.";

          if (error.response) {
            userFriendlyMessage =
              error.response.data.message ||
              `Error del servidor: ${error.response.status}`;
          } else if (error.request) {
            userFriendlyMessage =
              "No se pudo conectar al servidor. Inténtalo de nuevo.";
          }

          throw new Error(userFriendlyMessage);
        }
    },

    getBarbersBySite: async (siteId) => {
        try{
            const response = await apiClient.get(`/site/${siteId}/barbers`);
            return response.data.data;
        }catch (error){
          console.error("Error técnico al obtener los barberos:", error);

          let userFriendlyMessage = "Ocurrió un problema inesperado.";

          if (error.response) {
            userFriendlyMessage =
              error.response.data.message ||
              `Error del servidor: ${error.response.status}`;
          } else if (error.request) {
            userFriendlyMessage =
              "No se pudo conectar al servidor. Inténtalo de nuevo.";
          }

          throw new Error(userFriendlyMessage);
        }
    },

    getAvailableSlotsForBooking: async (barberId, date) => {
        try{
            const response = await apiClient.get(`/appointments/bookingslots?barberId=${barberId}&date=${date}`);
            return response.data.data
        }catch (error) {
            console.error("Error técnico al obtener la disponibilidad del barbero:", error);

          let userFriendlyMessage = "Ocurrió un problema inesperado.";

          if (error.response) {
            userFriendlyMessage =
              error.response.data.message ||
              `Error del servidor: ${error.response.status}`;
          } else if (error.request) {
            userFriendlyMessage =
              "No se pudo conectar al servidor. Inténtalo de nuevo.";
          }

          throw new Error(userFriendlyMessage);
        }
    },

    createAppointment: async (bookingData) => {
        try{
            const response = await apiClient.post('/appointments', bookingData);
            return response.data.data
        }catch (error){
            console.error("Error técnico al crear la reserva:", error);

          let userFriendlyMessage = "Ocurrió un problema inesperado.";

          if (error.response) {
            userFriendlyMessage =
              error.response.data.message ||
              `Error del servidor: ${error.response.status}`;
          } else if (error.request) {
            userFriendlyMessage =
              "No se pudo conectar al servidor. Inténtalo de nuevo.";
          }

          throw new Error(userFriendlyMessage);
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