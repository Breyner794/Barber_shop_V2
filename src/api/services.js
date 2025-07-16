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

    getServicesDashboard : async () => {
        try{
            const response = await apiClient.get('/services/dashboard-services');
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

    getSiteDashboard: async () => {
        try{
            const response = await apiClient.get('/site/site/dashboard');
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
      }catch{
        console.error("Error técnico al obtener los usuarios:", error);

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

  };

export default apiService;