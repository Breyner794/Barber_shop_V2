import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Clock, Tag, Check, X,LoaderCircle, AlertTriangle } from "lucide-react";
import apiService from '../../api/services.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Swal from 'sweetalert2';
import ServiceForm from './ServiceForm.jsx';

const ServicesModule = () => {
  
  const {currentUser} = useAuth();
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const hasPermission = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';

  const fetchServices = async () =>{

    setError(null);
    console.log("fectServices: Iniciando");
    try{
      const response  = await apiService.getServicesDashboard();
      const data = response.data || [];
      setServices(data);
      //console.log("data traida de la api es ", data)
    }catch (error){
      console.error('No se pudieron obtener los servicios. Inténtalo de nuevo.', error);
      setError('No se pudieron obtener los servicios. Inténtalo de nuevo.')
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() =>{
    fetchServices()
  },[]);

  const handleOpenForm = (service = null) => {
    setServiceToEdit(service); // Si se pasa un servicio, lo preparamos para editar
    setIsFormOpen(true);
  };
  // Función para cerrar el formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setServiceToEdit(null); // Limpiamos el estado de edición
  };

  // Función para guardar (crear o actualizar)
  const handleSaveService = async (submissionData, serviceId) => {
    try {
      if (serviceId) {
        // Si hay un _id, estamos actualizando un servicio existente
        // Debes tener una función 'updateService' en tu apiService
        await apiService.updateService(serviceId, submissionData);
        Swal.fire({ title: "¡Actualizado!", text: "El servicio se ha actualizado correctamente.", icon: "success", background: "#1F2937", color: "#E5E7EB" });
      } else {
        // Si no, estamos creando un nuevo servicio
        // Debes tener una función 'createService' en tu apiService
        await apiService.createService(submissionData);
        Swal.fire({ title: "¡Creado!", text: "El nuevo servicio ha sido creado.", icon: "success", background: "#1F2937", color: "#E5E7EB" });
      }
      handleCloseForm(); // Cierra el formulario
      fetchServices();  // Recarga la lista de servicios para ver los cambios
    } catch (error) {
       console.error("Error al guardar el servicio:", error);
      // Lanza el error para que el formulario lo capture y muestre
       throw new Error(error.response?.data?.message || "Ocurrió un error al guardar.");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if(!hasPermission){
      setError("No tienes permisos para eliminar el servicio.");
      return;
    }

    const confirmMessage = `¿Estás seguro de que deseas eliminar el servicio de forma permanente? Esta acción no se puede deshacer.`;

    const confirmDelete = await Swal.fire({
      title: "Confirmar eliminación",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Rojo para confirmar eliminación
      cancelButtonColor: "#6b7280", // Gris para cancelar
      confirmButtonText: "Si, eliminalo!",
      cancelButtonText: "Cancelar",
      reverseButtons: true, // Pone el botón de confirmar a la derecha
      customClass: {
        popup: "swal2-dark-mode",
        title: "text-white",
        htmlContainer: "text-gray-300",
        confirmButton: "hover:bg-red-700",
        cancelButton: "hover:bg-gray-700",
      },
      background: "#1F2937",
      color: "#E5E7EB",
    });
    if (confirmDelete.isConfirmed) {
      setIsDeleting(serviceId);
      try {
        await apiService.deleteService(serviceId);
        Swal.fire({
          icon: "success",
          title: "¡Usuario eliminado temporalmente!",
          text: "El usuario ha sido marcado como inactivo.",
          confirmButtonColor: "#38A169",
          customClass: {
            popup: "swal2-dark-mode",
            title: "text-white",
            htmlContainer: "text-gray-300",
          },
          background: "#1F2937",
          color: "#E5E7EB",
        });
        fetchServices();

        //console.log("Servicio eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        setError(error.message || "Error al eliminar el servicio");
      } finally {
        setIsDeleting(null);
      }
    }

  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-screen flex justify-center items-center">
        <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="ml-4 text-white text-xl">Cargando Sedes...</p>
      </div>
    );
  }

  return (
    // Contenedor principal con el fondo oscuro y padding responsivo
    <div className="bg-gradient-to-tr from-black to-blue-700/30 min-h-full p-4 sm:p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">
            Gestionar Servicios
          </span>
        </h2>
        {hasPermission ? (
                  <button
                    onClick={() => handleOpenForm()}
                    className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform 
                     bg-gradient-to-r from-teal-500 to-green-600 text-white
                     hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
            Nuevo Servicio
                  </button>
                ) : (
                  <div className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg 
                                 bg-gray-700 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
            Nuevo Servicio
                  </div>
                )}
      </div>

      {/* Mensaje de permisos para barberos */}
            {!hasPermission && (
              <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Solo puedes visualizar las sedes. Los permisos de creación, edición y eliminación están restringidos a los que no sean administradores.
              </div>
            )}

      {/* --- GRID DE TARJETAS DE SERVICIO (RESPONSIVO) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:border-green-500/50 hover:scale-[1.02]"
          >
            {/* --- Imagen de la Tarjeta --- */}
            <div className="relative">
                <img
                  src={service.image_Url}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                {/* --- Badge de Estado sobre la imagen --- */}
              <span
                className={`absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                  ${
                    service.isActive
                      ? "bg-green-500/10 text-green-300 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {service.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            
            {/* --- Contenido de la Tarjeta --- */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* --- Detalles (Precio y Duración) --- */}
              <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-gray-300">
                    <Tag className="w-5 h-5 text-green-400" />
                    <p className="text-lg font-semibold text-white">
                    ${service.price.toLocaleString("es-CO")}
                    </p>
                 </div>
                 <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5 text-green-400" />
                    <p className="font-medium">{service.duration} min</p>
                 </div>
              </div>
            </div>

            {/* --- Pie de la Tarjeta (Acciones) --- */}
            <div className="p-3 bg-gray-900/50 flex justify-end gap-2">
            {hasPermission ? (
              <>
              <button 
              className="flex-1 bg-gray-700/50 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors"
              onClick={() => handleOpenForm(service)}
              >
                  <Edit className="w-4 h-4" />
                    Editar
                </button>
                  <button
                    className="p-3 text-red-500 bg-gray-700/50 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
                onClick={() => handleDeleteService(service._id)}
                    disabled={isDeleting === service._id}
                >
                  {isDeleting === service._id ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ):(
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </>
            ):(
              <div className="flex-1 bg-gray-700/30 text-gray-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed">
              <Edit className="w-4 h-4" />
                  Solo visualización
              </div>
            )}
            </div>

          </div>
        ))}
      </div>

      {/* --- Mensaje por si no hay resultados --- */}
      {services.length === 0 && !isLoading && (
        <div className="text-center py-16 col-span-full">
          <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-3xl p-12 max-w-lg mx-auto">
            {/* Icono principal */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-full flex items-center justify-center border border-teal-500/30">
                <Tag className="w-10 h-10 text-teal-400" />
              </div>
            </div>
            
            {/* Título y descripción */}
            <h3 className="text-2xl font-bold text-white mb-3">
              No hay servicios disponibles todavía
            </h3>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              {hasPermission 
                ? 'Empieza a ofrecer tus servicios creando tu primer servicio. Añade detalles como precio, duración y descripciones para atraer clientes.'
                : 'Aún no se han creado servicios. Contacta con un administrador para añadir nuevos servicios al catálogo.'
              }
            </p>

            {/* Acciones sugeridas */}
            <div className="space-y-3">
              {hasPermission ? (
                <button
                  onClick={() => handleOpenForm()}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-lg hover:scale-105 transition-all duration-300 font-medium shadow-lg hover:shadow-green-500/25"
                >
                  <Plus className="w-5 h-5" />
                  Crea tu primer servicio
                </button>
              ) : null}
            </div>

            {/* Elementos decorativos */}
            <div className="mt-8 flex justify-center gap-4 opacity-30">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            {/* Sugerencias adicionales */}
            {hasPermission && (
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <p className="text-sm text-gray-500 mb-4">Ideas de servicios populares:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-xs">Corte de pelo</span>
                  <span className="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-xs">Recorte de barba</span>
                  <span className="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-xs">Lavado de cabello</span>
                  <span className="px-3 py-1 bg-gray-700/30 text-gray-400 rounded-full text-xs">Estilo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isFormOpen && (
        <ServiceForm
          currentUser={currentUser}
          serviceToEdit={serviceToEdit}
          onClose={handleCloseForm}
          onSave={handleSaveService}
        />
      )}
    </div>
  );
};

export default ServicesModule;