import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem('authToken');
    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

const apiService = {

    loginUser: async (credentials) => {
      try{

        const response = await apiClient.post('/auth/login', credentials);

        if(response.data && response.data.token){
          localStorage.setItem('authToken', response.data.token);
          return response.data.data.user;
        }
      }catch (error){
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },

    saveDayAvailability : async (barberId, dayOfWeek, dayData) => {
      try{
        const response = await apiClient.post(`availability/barber/${barberId}/day/${dayOfWeek}`, dayData)
        return response.data;
      }catch (error){

          console.error("Error técnico al guardar la plantilla semanal:", error);
          let userFriendlyMessage = "Ocurrió un problema inesperado.";
          if (error.response) {
            userFriendlyMessage =
              error.response.data.message ||
              `Error del servidor: ${error.response.status}`;
          } else if (error.request) {
            userFriendlyMessage =
              "No se pudo conectar al servidor.";
          }
          throw new Error(userFriendlyMessage);
      }
    },

    fetchMyProfile: async () => {
      try{
        const response = await apiClient.get('/user/me');
        return response.data.data;
      }catch(error){
        console.error("Error al obtener el perfil de usuario:", error);
        // Lanzamos el error para que AuthContext sepa que la sesión no es válida.
        throw new Error(error.response?.data?.message || 'Sesión no válida.');
      }
    },

    getAllBarbers: async () => {
      try {
        // Usamos los query params que tu controlador getAllUser espera
        const response = await apiClient.get('/user?role=barbero&isActive=true&limit=100');
        return response.data.data; // Devuelve el array de usuarios
      } catch (error) {
        console.error("Error fetching barbers list:", error);
        throw new Error(error.response?.data?.message || 'Could not fetch barbers.');
      }
    },

    getAllServices : async () => {
        try{
            const response = await apiClient.get('/services');
            return response.data;
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

    getServicesDashboard : async () => {
        try{
            const response = await apiClient.get('/services/dashboard-services');
            return response.data;
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
            return response.data;
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

    getSiteDashboard: async () => {
        try{
            const response = await apiClient.get('/site/site/dashboard');
            return response.data;
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
            console.error("Error técnico al crear el servicio completado:", error);
         if (error.response) {
      // El error ya tiene response.data, solo pasarlo
      throw error;
    } else if (error.request) {
      // Solo para errores de conexión crear nuevo error
      throw new Error("No se pudo conectar al servidor. Inténtalo de nuevo.");
    } else {
      throw new Error("Ocurrió un problema inesperado.");
    }
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

    getBarberAvailability: async (barberId) =>{
      try{

        const response = await apiClient.get(`/availability/barber/${barberId}`);
        return response.data.data;

      }catch (error){
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

    /*Esta Api traera las disponibilidades excepcionales.*/
    getAvailabilityExceptions: async (barberId, date) => {
      try{
        const response = await apiClient.get(`availability/exceptions/barber/${barberId}/${date}`);
        return response.data.data;
      }catch (error){
        console.error("Error técnico al obtener la disponibilidad excepcionales del barbero:", error);

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

    saveBarberExceptionForDate: async (barberId, date, timeSlots, isWorkingDay) => {
      try{

        const response = await apiClient.post('/availability/exceptions',{
          barberId,
          date,
          timeSlots,
          isWorkingDay,
        });

        return response.data;

      }catch (error) {
        console.error("Error técnico al obtener la disponibilidad excepcionales del barbero:", error);

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

    deleteBarberExceptionForDate : async (barberId, date) =>{
      try{
        const response = await apiClient.delete(`/availability/exceptions/delete/barber/${barberId}/date/${date}`);

      return response.data;
      }catch (error){
          console.error("Error técnico al obtener la disponibilidad excepcionales del barbero:", error);

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

    updateMyProfile: async (formData) =>{
      try{
        const response = await apiClient.patch('/user/update-my-profile',formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorizationd': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        return response.data;
      }catch (error){
        console.error("Error técnico al actualizar tu perfil:", error);

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

    changeMyPassword : async ({currentPassword, newPassword}) =>{
      try{

        const response = await apiClient.patch('/user/change-my-password', {
          currentPassword,
          newPassword
      });
      return response.data;
      }catch(error){
       console.error("Error técnico al actualizar tu contraseña:", error);
        throw error; 
      }
    },

    getAllUsers: async() => {
      try{
        const response = await apiClient.get('/user/');
        return response.data;
      }catch (error){
        console.error("Error técnico al crear el servicio completado:", error);
         if (error.response) {
      // El error ya tiene response.data, solo pasarlo
      throw error;
    } else if (error.request) {
      // Solo para errores de conexión crear nuevo error
      throw new Error("No se pudo conectar al servidor. Inténtalo de nuevo.");
    } else {
      throw new Error("Ocurrió un problema inesperado.");
    }
      }
    },

    createUser: async (userData) => {
      try{
        const response = await apiClient.post('/user/create-new-user', userData,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorizationd': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        return response.data.data;
      }catch(error){
        console.error("Error técnico al crear el usuario:", error);

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

    updateUser : async (userId, userData) => {
      try{
        const response = await apiClient.patch(`/user/admin/update/${userId}`, userData,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorizationd': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        return response.data;
      }catch (error){
        console.error("Error técnico al actualizar el usuario en modo admin:", error);

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

    deleteEasyUser: async (userId) =>{
      try{
        const response = await apiClient.delete(`/user/admin/delete/${userId}`);
        return response.data;
      }catch (error){
        console.error("Error técnico no se pudo eliminar el usuario en modo admin:", error);

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

    /*API EXCLUSIVA PARA SUPERADMIN - HACE FUNCIONES QUE PUEDEN BORRAR DATOS IMPORTANTES.*/

    superUpdateUser : async (userId, userData) => {
      try{
        const response = await apiClient.patch(`/user/superadmin/update/${userId}`, userData,{
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorizationd': `Bearer ${localStorage.getItem('authToken')}`,
          }
        })
        return response.data;
      }catch (error){
        console.error("Error técnico no se pudo actualizar el usuario en modo SuperAdmin:", error);

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

    hardDeleteUser : async (userId) => {
      try{
        const response = await apiClient.delete(`/user/superadmin/delete/${userId}`);
        return response.data;
      }catch (error){
        console.error("Error técnico no se pudo eliminar el usuario en modo SuperAdmin:", error);

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

    createSite : async (siteData) => {
      try{

        const response = await apiClient.post('/site/', siteData);
        return response.data.data;

      }catch (error){
         console.error("Error técnico al crear la sede:", error);

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
    
    deleteSite : async (siteId) => {
      try{
        const response = await apiClient.delete(`/site/${siteId}`);
        return response.data;
      }catch (error){
        console.error("Error técnico no se pudo eliminar la sede:", error);

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

    updateSite : async (siteId, siteData) => {
      try{
        const response = await apiClient.put(`/site/${siteId}`, siteData);
        return response.data.data
      }catch (error){
        console.error("Error técnico no se pudo actualizar la sede:", error);

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

    createService : async (serviceData) => {
      try{

        const response = await apiClient.post('/services/', serviceData,{
          headers:{
            'Content-Type': 'multipart/form-data',
            'Authorizationd': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        return response.data.data;

      }catch (error){
         console.error("Error técnico al crear la sede:", error);

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

    updateService : async (serviceId, serviceData) => {
      try{
        const response = await apiClient.put(`/services/${serviceId}`, serviceData,{
          headers:{
            'Content-Type': 'multipart/form-data',
            'Authorizationd': `Bearer ${localStorage.getItem('authToken')}`,
          }
        });
        return response.data.data
      }catch (error){
        console.error("Error técnico no se pudo actualizar la sede:", error);

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

    deleteService : async (serviceId) => {
      try{
        const response = await apiClient.delete(`/services/${serviceId}`);
        return response.data;
      }catch (error){
        console.error("Error técnico no se pudo eliminar el servicio:", error);

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

    getAllAppointments : async () => {
      try{
         const response = await apiClient.get('/appointments/');
         return response.data;
      }catch (error){
        console.error("Error técnico al obtener la reserva desde la base de datos:", error);

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

    getAppointmentsByBarber : async (barberId) => {
      if (!barberId) throw new Error("Se requiere el ID del barbero.");
      try {
        // Llama al nuevo endpoint que creaste
        const response = await apiClient.get(`/appointments/barber/${barberId}`);
        return response.data;
      } catch (error) {
        console.error(
          `Error al obtener las reservas para el barbero ${barberId}:`,
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            `No se pudieron cargar las reservas del barbero.`
        );
      }
    },

    updateAppointmentStatus : async (appointmentId, status, notes) => {
  if (!appointmentId || !status) throw new Error("Se requieren el ID de la reserva y el nuevo estado.");
  try {
    const payload = { status, notes };
    // Usamos PATCH porque solo estamos actualizando una parte del recurso.
    const response = await apiClient.patch(
      `/appointments/${appointmentId}/status`,
      payload
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Error al actualizar la reserva ${appointmentId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "No se pudo actualizar el estado."
    );
  }
    },

    createCompletedService : async (newServiceComplete) =>{
      try {
        const response = await apiClient.post(
          "/appointments/completed-service",
          newServiceComplete
        );
        return response.data;
      } catch (error) {
        console.error("Error técnico al crear el servicio completado:", error);
         if (error.response) {
      // El error ya tiene response.data, solo pasarlo
      throw error;
    } else if (error.request) {
      // Solo para errores de conexión crear nuevo error
      throw new Error("No se pudo conectar al servidor. Inténtalo de nuevo.");
    } else {
      throw new Error("Ocurrió un problema inesperado.");
    }
      }
    },

    updateAppointment : async (appointmentId, updateData) => {
      try{

        const response = await apiClient.patch(
          `/appointments/updateappointment/${appointmentId}`, 
          updateData
        );

        return response.data;
      }catch (err){
        console.error("Error técnico al actualizar el registro.:", err);

          let userFriendlyMessage = "Ocurrió un problema inesperado.";

          if (err.response) {
            userFriendlyMessage =
              err.response.data.message ||
              `Error del servidor: ${err.response.status}`;
          } else if (err.request) {
            userFriendlyMessage =
              "No se pudo conectar al servidor. Inténtalo de nuevo.";
          }

          throw new Error(userFriendlyMessage);
      }
    },

    deleteAppointment : async (appointmentId, data) => {
        try {
            const response = await apiClient.delete(`/appointments/delete/${appointmentId}`, { data: data });
            return response.data;
        } catch (error) {
            console.error("Error técnico no se pudo eliminar la reserva:", error);

            // Simplemente lanza el error original o un objeto de error más estructurado
            // para que el componente que llama pueda acceder a error.response
            if (error.response) {
                // Si hay una respuesta del servidor, lanza ese error
                throw error; 
            } else if (error.request) {
                // Si no hay respuesta del servidor (problema de red)
                throw new Error("No se pudo conectar al servidor. Inténtalo de nuevo.");
            } else {
                // Otro tipo de error
                throw new Error("Ocurrió un problema inesperado al eliminar la cita.");
            }
        }
    },

    // --- NUEVAS FUNCIONES PARA LAS APIs DE ANÁLISIS ---

    /**
     * Obtiene el conteo de reservas diarias en un rango de fechas.
     * @param {string} startDate - Fecha de inicio en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha de fin en formato 'YYYY-MM-DD'.
     * @param {string} [barberId] - Opcional: ID del barbero para filtrar.
     * @param {string} [status] - Opcional: Estados de citas a incluir, separados por comas (ej. "pendiente,confirmada,completada").
     * @returns {Promise<Array>} Array de objetos con { date: string, count: number }.
     */
    getDailyBookings: async (startDate, endDate, barberId = null, status = null) => { // <-- Añade 'status' aquí
        try {
            const params = { startDate, endDate };
            if (barberId) {
                params.barberId = barberId;
            }
            if (status) { // Añade status a los parámetros si se proporciona
                params.status = status;
            }
            const response = await apiClient.get('/analytics/daily-bookings', {
                params: params
            });
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching daily bookings:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch daily bookings');
        }
    },

    /**
     * Obtiene el conteo de reservas por estado (pendiente, confirmada, etc.).
     * @returns {Promise<Array>} Array de objetos con { status: string, count: number }.
     */
    getBookingsByStatus: async () => {
        try {
            const response = await apiClient.get('/analytics/bookings-by-status');
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching bookings by status:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch bookings by status');
        }
    },

    /**
     * Obtiene los servicios más populares por conteo de reservas.
     * @returns {Promise<Array>} Array de objetos con { serviceId: string, serviceName: string, count: number }.
     */
    getTopServices: async () => {
        try {
            const response = await apiClient.get('/analytics/top-services');
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching top services:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch top services');
        }
    },

    /**
     * Obtiene los barberos con más reservas.
     * @returns {Promise<Array>} Array de objetos con { barberId: string, barberName: string, count: number }.
     */
    getTopBarbers: async () => {
        try {
            const response = await apiClient.get('/analytics/top-barbers');
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching top barbers:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch top barbers');
        }
    },

    /**
     * Obtiene la tasa de ocupación para un barbero y un rango de fechas.
     * @param {string} startDate - Fecha de inicio en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha de fin en formato 'YYYY-MM-DD'.
     * @param {string} barberId - ID del barbero.
     * @param {string} [siteId] - Opcional: ID de la sede.
     * @returns {Promise<Object>} Objeto con la tasa de ocupación.
     */
    getOccupancyRate: async (startDate, endDate, barberId, siteId = null) => { // <-- Modificado para rango de fechas
        try {
            const params = { startDate, endDate, barberId }; // <-- Pasa startDate y endDate
            if (siteId) params.siteId = siteId;
            const response = await apiClient.get('/analytics/occupancy-rate', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching occupancy rate:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch occupancy rate');
        }
    },

    /**
     * Obtiene una lista de clientes recurrentes.
     * @param {number} [minBookings] - Opcional: Número mínimo de reservas para ser considerado recurrente.
     * @returns {Promise<Array>} Array de objetos con { _id: string (phone), clientName: string, totalBookings: number, lastBookingDate: string }.
     */
    getRecurringClients: async (minBookings = null) => {
        try {
            const params = minBookings ? { minBookings } : {};
            const response = await apiClient.get('/analytics/recurring-clients', { params });
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching recurring clients:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch recurring clients');
        }
    },

    /**
     * Obtiene la recaudación total de servicios completados en un rango de fechas.
     * @param {string} startDate - Fecha de inicio en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha de fin en formato 'YYYY-MM-DD'.
     * @returns {Promise<Object>} Objeto con totalRevenue.
     */
    getRevenueByDateRange: async (startDate, endDate) => {
        try {
            const response = await apiClient.get('/analytics/revenue-by-date-range', {
                params: { startDate, endDate }
            });
            return response.data; // Este endpoint devuelve el objeto directamente
        } catch (error) {
            console.error('Error fetching revenue by date range:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch revenue by date range');
        }
    },

    /**
     * Obtiene la recaudación agrupada por barbero o por servicio en un rango de fechas.
     * @param {string} startDate - Fecha de inicio en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha de fin en formato 'YYYY-MM-DD'.
     * @param {'barber'|'service'} [groupBy] - Opcional: 'barber' para agrupar por barbero, 'service' para agrupar por servicio.
     * @returns {Promise<Array|Object>} Array de objetos si se agrupa, o un objeto con totalRevenue si no se agrupa.
     */
    getRevenueByBarberOrService: async (startDate, endDate, groupBy = null) => {
        try {
            const params = { startDate, endDate };
            if (groupBy) params.groupBy = groupBy;
            const response = await apiClient.get('/analytics/revenue-by-barber-or-service', { params });
            return response.data; // Este endpoint devuelve el objeto directamente (con la propiedad 'data')
        } catch (error) {
            console.error('Error fetching revenue by barber or service:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch revenue by barber or service');
        }
    },

    /**
     * Obtiene el estado de los servicios (activos e inactivos).
     * @returns {Promise<Object>} Objeto con activeServices y inactiveServices.
     */
    getServiceStatus: async () => {
        try {
            const response = await apiClient.get('/analytics/service-status');
            return response.data; // Este endpoint devuelve el objeto directamente (con la propiedad 'data')
        } catch (error) {
            console.error('Error fetching service status:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch service status');
        }
    },

    /**
     * Obtiene la tasa de cancelación de citas en un rango de fechas.
     * @param {string} startDate - Fecha de inicio en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha de fin en formato 'YYYY-MM-DD'.
     * @returns {Promise<Object>} Objeto con totalAppointments, cancelledAppointments, cancellationRate.
     */
    getCancellationRate: async (startDate, endDate) => {
        try {
            const response = await apiClient.get('/analytics/cancellation-rate', {
                params: { startDate, endDate }
            });
            return response.data; // Este endpoint devuelve el objeto directamente
        } catch (error) {
            console.error('Error fetching cancellation rate:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch cancellation rate');
        }
    },

    // --- NUEVA FUNCIÓN EN apiService PARA EL DASHBOARD ---
    /**
     * Obtiene las citas próximas para el dashboard, filtrando por barbero si se proporciona.
     * @param {string} [barberId] - Opcional: ID del barbero para filtrar.
     * @param {number} [limit] - Opcional: Número máximo de citas a devolver (por defecto 5).
     * @returns {Promise<Array>} Array de objetos de citas próximas.
     */
    getUpcomingAppointmentsForDashboard: async (barberId = null, limit = 5) => {
        try {
            const params = { limit };
            if (barberId) {
                params.barberId = barberId;
            }
            const response = await apiClient.get('/appointments/upcoming-dashboard', { params });
            // Esta API devuelve { success, message, count, data }
            return response.data.data; 
        } catch (error) {
            console.error('Error fetching upcoming appointments for dashboard:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch upcoming appointments for dashboard');
        }
    },

    // --- NUEVAS FUNCIONES PARA LOS CONTADORES DE KPIs ---

    /**
     * Obtiene el conteo de barberos activos.
     * @returns {Promise<number>} El número de barberos activos.
     */
    getActiveBarbersCount: async () => {
        try {
            // Asumiendo que la ruta es /api/users/active-barbers-count
            const response = await apiClient.get('/user/active-barbers-count');
            return response.data.count;
        } catch (error) {
            console.error('Error fetching active barbers count:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch active barbers count');
        }
    },

    /**
     * Obtiene el conteo de sedes activas.
     * @returns {Promise<number>} El número de sedes activas.
     */
    getActiveBranchesCount: async () => {
        try {
            // Asumiendo que la ruta es /api/sites/active-count
            const response = await apiClient.get('/site/active-count');
            return response.data.count;
        } catch (error) {
            console.error('Error fetching active branches count:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch active branches count');
        }
    },
  };

export default apiService;