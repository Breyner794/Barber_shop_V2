import React, { useState, useEffect, useRef } from "react"; // Importar useRef
import { X, Save, AlertTriangle,XCircle, Info, User, Settings, AlertCircle, Crown, Check, CheckCircle, Calendar, Clock, FileText } from "lucide-react";
import apiService from "../../api/services.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Swal from "sweetalert2";

const BookingForm = ({
  booking,
  onClose,
  onSaveSuccess,
  barbers,
  services,
  sites,
}) => {
  const { currentUser } = useAuth();

  const isEditing = Boolean(booking);

  const isBarberUser = currentUser?.role === "barbero";

  const [fieldErrors, setFieldErrors] = useState({});

  const originalBookingRef = useRef(null);
  useEffect(() => {
    if (isEditing && booking && !originalBookingRef.current) {
      originalBookingRef.current = {
        barberId: booking.barberId,
        date: booking.date.split("T")[0],
        startTime: booking.startTime,
        endTime: booking.endTime,
        siteId: booking.locationId
      };
      // --- DEBUG 2: Valor del originalBookingRef al inicializarse ---
      // console.log(
      //   "DEBUG 2: originalBookingRef inicializado:",
      //   originalBookingRef.current
      // );
    }
  }, [isEditing, booking]);


  const [formData, setFormData] = useState(() => {
    const initialBarberId =
      (isBarberUser && !isEditing && currentUser._id) || booking?.barberId || "";
    const initialSiteId =
      (isBarberUser && !isEditing && currentUser?.site_barber._id) ||
      booking?.locationId || "";

      // --- DEBUG 3: Valores iniciales calculados para formData ---
    // console.log("DEBUG 3: Calculando initial formData states:");
    // console.log("  initialBarberId:", initialBarberId);
    // console.log("  initialSiteId:", initialSiteId);

    return {
      clientName: booking?.clientName || "",
      clientPhone: booking?.clientPhone || "",
      barberId: initialBarberId,
      serviceId: booking?.serviceId || "",
      siteId: initialSiteId,
      notes: booking?.notes || "",
      status: booking?.status || "pendiente",
    };
  });

  // --- DEBUG 4: Valor actual de formData después de la inicialización ---
  // Este log te mostrará el objeto formData completo justo después de su definición
  // y cada vez que se actualice.
  // console.log("DEBUG 4: formData actual:", formData);

  const [selectedDate, setSelectedDate] = useState(() => {
    // Siempre precargar la fecha si estamos editando
    if (isEditing && booking?.date) {   
      return booking.date.split("T")[0];
    }

    // --- DEBUG 5: Condición para fecha inicial si no es edición y hay barbero ---
    // console.log("DEBUG 5: Condición para selectedDate en nueva reserva:");
    // console.log("  !isEditing:", !isEditing);
    // console.log("  formData.barberId (para fecha inicial):", formData.barberId);


    if (!isEditing && formData.barberId) {
      return new Date().toISOString().split("T")[0];
    }
    return "";
  });

  const [selectedTime, setSelectedTime] = useState(() => {
    // Siempre precargar la hora si estamos editando
    if (isEditing && booking?.startTime) {
      return booking.startTime;
    }
    return "";
  });

  // --- DEBUG 6: selectedDate y selectedTime después de la inicialización ---
  // console.log("DEBUG 6: selectedDate inicial/actual:", selectedDate);
  // console.log("DEBUG 6: selectedTime inicial/actual:", selectedTime);

  const [availableSlots, setAvailableSlots] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState(null);

  // Efecto para precargar datos de barbero/sede si es un barbero y está creando
  useEffect(() => {

    // --- DEBUG 7: Entrando al useEffect de precarga (barbero/sede) ---
    // console.log("DEBUG 7: Entrando al useEffect de precarga (barbero/sede).");
    // console.log("  isBarberUser:", isBarberUser);
    // console.log("  isEditing:", isEditing);
    // console.log("  currentUser._id:", currentUser?._id);
    // console.log("  currentUser.site_barber?._id:", currentUser?.site_barber?._id);
    // console.log("  formData.barberId (antes de actualizar):", formData.barberId);
    // console.log("  formData.siteId (antes de actualizar):", formData.siteId);

    if (isBarberUser && !isEditing) {
      if (
        currentUser?.site_barber?._id &&
        formData.siteId !== currentUser.site_barber._id
      ) {
        setFormData((prev) => ({
          ...prev,
          siteId: currentUser.site_barber._id,
        }));
        // --- DEBUG 8: siteId actualizado por precarga ---
        // console.log("DEBUG 8: siteId actualizado a:", currentUser.site_barber._id);
      }
      if (currentUser?._id && formData.barberId !== currentUser._id) {
        setFormData((prev) => ({
          ...prev,
          barberId: currentUser._id,
        }));
        // --- DEBUG 9: barberId actualizado por precarga ---
        // console.log("DEBUG 9: barberId actualizado a:", currentUser._id);
      }
    }
  }, [isBarberUser, isEditing, currentUser, formData.siteId, formData.barberId]);

  // Efecto para cargar los slots disponibles
useEffect(() => {
  let shouldFetchSlots = false;
  
  if (!isEditing) {
    shouldFetchSlots = Boolean(formData.barberId && selectedDate);
  } else {
    shouldFetchSlots = Boolean(formData.barberId && selectedDate);
  }

  const fetchSlots = async () => {
    if (shouldFetchSlots) {
      setIsLoadingSlots(true);
      setError(null);
      
      try {
        const responseData = await apiService.getAvailableSlotsForBooking(
          formData.barberId,
          selectedDate
        );
        
        // IMPORTANTE: Incluir el horario actual de la reserva si está en la misma fecha
        let slotsToShow = responseData || [];
        
        if (isEditing && 
            selectedDate === originalBookingRef.current?.date && 
            booking?.startTime) {
          
          // Verificar si el horario actual ya está en la lista
          const currentSlotExists = slotsToShow.some(
            slot => slot.startTime === booking.startTime
          );
          
          // Si no está en la lista, agregarlo (para que aparezca como opción)
          if (!currentSlotExists) {
            slotsToShow.unshift({
              startTime: booking.startTime,
              endTime: booking.endTime,
              isCurrentBooking: true // Flag para identificarlo en el UI
            });
          }
        }
        
        setAvailableSlots(slotsToShow);
        
      } catch (apiError) {
        console.error("Error al cargar horarios:", apiError);
        setError("No se pudieron cargar los horarios disponibles.");
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    } else {
      setAvailableSlots([]);
    }
  };

  fetchSlots();
}, [formData.barberId, selectedDate, isEditing, booking?.startTime]);

  const validateField = (name, value) => {
  const errors = { ...fieldErrors };
  
  switch (name) {
    case 'clientName':
      if (!value.trim()) {
        errors.clientName = 'El nombre del cliente es obligatorio';
      } else if (value.trim().length < 2) {
        errors.clientName = 'El nombre debe tener al menos 2 caracteres';
      } else if (value.trim().length > 100) {
        errors.clientName = 'El nombre no puede exceder 100 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(value.trim())) {
        errors.clientName = 'El nombre solo puede contener letras y espacios';
      } else {
        delete errors.clientName;
      }
      break;

    case 'clientPhone':
      if (value && value.trim()) {
        // Solo validar si se proporciona un teléfono (es opcional)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value.trim())) {
          errors.clientPhone = 'El teléfono solo puede contener números, espacios y símbolos (+, -, (), )';
        } else if (value.trim().length < 7) {
          errors.clientPhone = 'El teléfono debe tener al menos 7 dígitos';
        } else if (value.trim().length > 10) {
          errors.clientPhone = 'El teléfono no puede exceder 10 caracteres';
        } else {
          delete errors.clientPhone;
        }
      } else {
        delete errors.clientPhone; // Es opcional
      }
      break;

    case 'barberId':
      if (!value) {
        errors.barberId = 'Debes seleccionar un barbero';
      } else {
        delete errors.barberId;
      }
      break;

    case 'serviceId':
      if (!value) {
        errors.serviceId = 'Debes seleccionar un servicio';
      } else {
        delete errors.serviceId;
      }
      break;

    case 'siteId':
      if (!value && (currentUser.role === "admin" || currentUser.role === "superadmin")) {
        errors.siteId = 'Debes seleccionar una sede';
      } else {
        delete errors.siteId;
      }
      break;

    case 'notes':
      if (value && value.length > 500) {
        errors.notes = 'Las notas no pueden exceder 500 caracteres';
      } else {
        delete errors.notes;
      }
      break;

    default:
      break;
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

// Función para validar fecha y hora
// Mejorar la función validateDateTime para ser más específica:
const validateDateTime = () => {
  const errors = { ...fieldErrors };
  
  // Solo validar fecha si hay una fecha seleccionada
  if (selectedDate) {
    const selectedDateObj = new Date(selectedDate);
    const todayString = new Date().toISOString().split("T")[0];
    
    if (selectedDateObj < todayString) {
      errors.selectedDate = 'No puedes seleccionar una fecha pasada';
    } else {
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      
      if (selectedDateObj > threeMonthsLater) {
        errors.selectedDate = 'No puedes programar reservas con más de 3 meses de anticipación';
      } else {
        delete errors.selectedDate;
      }
    }
  }

  // Solo validar hora si hay fecha Y hay slots disponibles O está en edición
  if (selectedDate && (availableSlots.length > 0 || isEditing)) {
    if (!selectedTime) {
      errors.selectedTime = 'Debes seleccionar una hora';
    } else {
      const isTimeAvailable = availableSlots.some(slot => slot.startTime === selectedTime);
      const isOriginalTime = isEditing && booking?.startTime === selectedTime;
      
      if (!isTimeAvailable && !isOriginalTime) {
        errors.selectedTime = 'La hora seleccionada ya no está disponible';
      } else {
        delete errors.selectedTime;
      }
    }
  }

  setFieldErrors(errors);
  return !errors.selectedDate && !errors.selectedTime;
};


  const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));
  
  // Validar el campo mientras el usuario escribe (con debounce)
  setTimeout(() => {
    validateField(name, value);
  }, 300);

  // Limpiar error general si existe
  if (error) {
    setError(null);
  }

  if (name === "barberId") {
    setSelectedDate("");
    setSelectedTime("");
    // Limpiar errores de fecha y hora cuando cambia el barbero
    const errors = { ...fieldErrors };
    delete errors.selectedDate;
    delete errors.selectedTime;
    setFieldErrors(errors);
  }
};

  const handleDateChange = (e) => {
  const newDate = e.target.value;
  
  // Actualizar estados inmediatamente
  setSelectedDate(newDate);
  setSelectedTime('');
  
  // Limpiar errores de fecha y hora INMEDIATAMENTE
  setFieldErrors(prev => {
    const errors = { ...prev };
    delete errors.selectedDate;
    delete errors.selectedTime;
    return errors;
  });

  if (error) {
    setError(null);
  }
};

  const handleTimeChange = (e) => {
  const newTime = e.target.value;
  
  // Actualizar estado inmediatamente
  setSelectedTime(newTime);
  
  // Limpiar errores de hora INMEDIATAMENTE
  setFieldErrors(prev => {
    const errors = { ...prev };
    delete errors.selectedTime;
    return errors;
  });
  
  // Limpiar error general
  if (error) {
    setError(null);
  }

  // NO usar setTimeout para validación
};

// Modificar validateForm para manejar mejor los casos edge:
const validateForm = () => {
  let hasErrors = false;

  // Validar todos los campos básicos
  const fieldsToValidate = ['clientName', 'clientPhone', 'barberId', 'serviceId', 'siteId', 'notes'];
  
  fieldsToValidate.forEach(field => {
    const value = formData[field] || '';
    if (!validateField(field, value)) {
      hasErrors = true;
    }
  });

  // Validación específica para fecha y hora
  if (!selectedDate) {
    setFieldErrors(prev => ({ ...prev, selectedDate: 'Debes seleccionar una fecha' }));
    hasErrors = true;
  } else {
    // Si hay fecha, validar que sea válida
    if (!validateDateTime()) {
      hasErrors = true;
    }
    
    // Si no está cargando y no hay slots disponibles, es un error
    if (!isLoadingSlots && availableSlots.length === 0 && !isEditing) {
      setFieldErrors(prev => ({ 
        ...prev, 
        selectedDate: 'No hay horarios disponibles para esta fecha. Selecciona otra fecha.' 
      }));
      hasErrors = true;
    }
    
    // Si hay slots pero no se seleccionó hora
    if (availableSlots.length > 0 && !selectedTime) {
      setFieldErrors(prev => ({ ...prev, selectedTime: 'Debes seleccionar una hora' }));
      hasErrors = true;
    }
  }

  // Para edición, validaciones especiales
  if (isEditing) {
    const hasRescheduleIntent =
      formData.barberId.toString() !== originalBookingRef.current?.barberId.toString() ||
      selectedDate !== originalBookingRef.current?.date;

    if (hasRescheduleIntent && (!selectedDate || !selectedTime)) {
      setError("Por favor, selecciona una nueva fecha y hora para el reagendamiento.");
      hasErrors = true;
    }
  }

  if (hasErrors) {
    const firstError = Object.values(fieldErrors)[0];
    if (firstError) {
      setError(firstError);
    }
    return false;
  }

  return true;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

  // Validar formulario completo
  if (!validateForm()) {
      setIsLoading(false);
      return;
    }

  // El resto del código de handleSubmit permanece igual...
    let finalEndTime = null;
    const currentSelectedSlot = availableSlots.find(
      (slot) => slot.startTime === selectedTime
    );

    if (currentSelectedSlot) {
      finalEndTime = currentSelectedSlot.endTime;
    } else if (
      isEditing &&
      selectedTime === booking?.startTime &&
      booking?.endTime
    ) {
      finalEndTime = booking.endTime;
    }

    if (!finalEndTime) {
      setError(
        "No se pudo determinar la hora de finalización de la reserva. Por favor, asegúrate de que la hora seleccionada sea válida."
      );
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      date: selectedDate,
      startTime: selectedTime,
      endTime: finalEndTime,
    };

    try {
      if (isEditing) {
        await apiService.updateAppointment(booking.id, payload);
      
        Swal.fire({
        title: "¡Actualización Aplicada Correctamente!",
        text: `Se actualizó la reserva de ${payload.clientName}.`,
          icon: "success",
          confirmButtonColor: "#2cb9fd",
          customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
          background: "#1F2937",
          color: "#E5E7EB",
        });
      } else {
        await apiService.createAppointment(payload);
      
        Swal.fire({
        title: "Reserva Creada Exitosamente",
        text: `Se creó exitosamente la reserva para ${payload.clientName}, para la fecha ${payload.date} a las ${payload.startTime}`,
          icon: "success",
          confirmButtonColor: "#2cb9fd",
          customClass: {
              popup: "swal2-dark-mode",
              title: "text-white",
              htmlContainer: "text-gray-300",
            },
          background: "#1F2937",
          color: "#E5E7EB",
        });
      }
      onSaveSuccess();
      onClose();
    } catch (apiError) {
    console.error("Error al guardar la reserva:", apiError);
      setError(
      apiError.response?.message || "Ocurrió un error inesperado al guardar la reserva."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const minDateForInput = new Date().toISOString().split("T")[0];

  const createLocalDate = (dateString) => {
  if (!dateString) return null;
  
  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(year, month - 1, day);
};

const formatLocalDate = (dateString) => {
  if (!dateString) return '';
  
  const localDate = createLocalDate(dateString);
  
  return localDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Editar Reserva" : "Nueva Reserva"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Aviso de Rol para Barberos */}
        {currentUser.role === "barbero" && (
          <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 p-4 rounded-lg mb-4 flex items-start gap-3">
            <Info size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">
                Información para Barberos
              </p>
              <p className="text-xs text-blue-300">
                Tu perfil y sede se preseleccionan automáticamente. Solo
                necesitas configurar el cliente, servicio y horario para la
                reserva.
              </p>
            </div>
          </div>
        )}

        {/* Aviso de Rol para Admins */}
        {(currentUser.role === "admin" ||
          currentUser.role === "superadmin") && (
          <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 p-4 rounded-lg mb-4 flex items-start gap-3">
            <Crown size={18} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Panel de Administrador</p>
              <p className="text-xs text-purple-300">
                Puedes crear reservas para cualquier barbero y sede. Recuerda
                que la disponibilidad cambia según el barbero seleccionado.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-600">
              <User size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Información del Cliente
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Ingresa el nombre completo"
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                    fieldErrors.clientName
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {fieldErrors.clientName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {fieldErrors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  placeholder="3XXXXXXXXX (10 dígitos)"
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                    fieldErrors.clientPhone
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {fieldErrors.clientPhone && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {fieldErrors.clientPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Configuración del Servicio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-600">
              <Settings size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Configuración del Servicio
              </h3>
            </div>

            {currentUser.role === "admin" ||
            currentUser.role === "superadmin" ? (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Barbero *
                  </label>
                  <select
                    name="barberId"
                    value={formData.barberId}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                      fieldErrors.barberId
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
                  >
                    <option value="">-- Seleccionar Barbero --</option>
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.barberId && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {fieldErrors.barberId}
                    </p>
                  )}
                  {!fieldErrors.barberId && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      La disponibilidad de horarios depende del barbero
                      seleccionado
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Sede
                  </label>
                  <select
                    name="siteId"
                    value={formData.siteId}
                    onChange={handleInputChange}
                    className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                      fieldErrors.siteId
                        ? "border-red-500 focus:ring-2 focus:ring-red-500"
                        : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
                  >
                    <option value="">-- Seleccionar Sede --</option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.siteId && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {fieldErrors.siteId}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Info size={14} />
                    <span className="text-xs font-medium">
                      Barbero asignado automáticamente
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Las reservas se registrarán bajo tu perfil de barbero.
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Info size={14} />
                    <span className="text-xs font-medium">
                      Sede asignada automáticamente
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    El servicio se registrará en tu sede asignada
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Servicio *
              </label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all ${
                  fieldErrors.serviceId
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
              >
                <option value="">-- Seleccionar Servicio --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {fieldErrors.serviceId && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {fieldErrors.serviceId}
                </p>
              )}
            </div>
          </div>

          {/* Programación */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Programación
              </h3>
            </div>

            {/* Aviso sobre disponibilidad de horarios */}
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-3 rounded-lg flex items-start gap-2 text-xs">
              <Clock size={14} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Disponibilidad de Horarios</p>
                <p className="text-amber-300">
                  Los horarios disponibles cambian según el barbero seleccionado
                  y su agenda del día. Selecciona primero el barbero para ver
                  las opciones disponibles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Fecha *
                </label>
                {isEditing && (
                  <div className="flex items-center gap-1.5 p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-xs mb-2">
                    <Info size={14} />
                    <span>
                      Fecha actual: <strong>{new Date(booking?.date).toLocaleDateString('es-ES')}</strong>.
                      {selectedDate !== originalBookingRef.current?.date
                        ? " Al cambiar fecha, deberás elegir nueva hora."
                        : " Puedes cambiar la fecha para reagendar."
                      }
                    </span>
                  </div>
                )}

                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={minDateForInput}
                  disabled={!formData.barberId}
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                    /* Estilos seguros para todos los navegadores */ 
                    max-w-full 
                    min-w-0 
                    box-border 
                    /* Fixes específicos para iOS/Safari únicamente */ 
                    supports-[(-webkit-appearance:none)]:[-webkit-appearance:none] 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-date-and-time-value]:text-left 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-datetime-edit]:flex 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-datetime-edit]:items-center 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-datetime-edit]:justify-start 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-datetime-edit-fields-wrapper]:flex 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-datetime-edit-fields-wrapper]:items-center 
                    supports-[(-webkit-appearance:none)]:[&::-webkit-datetime-edit-text]:px-0.5 
                    ${fieldErrors.selectedDate
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : selectedDate && isEditing && selectedDate !== originalBookingRef.current?.date
                        ? "border-yellow-500 focus:ring-2 focus:ring-yellow-500" 
                        : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
                  style={{
                    /* Fallback CSS para mayor compatibilidad */
                    WebkitAppearance: "none",
                    maxWidth: "100%",
                    minWidth: "0",
                    boxSizing: "border-box",
                  }}
                />

                {/* Error de validación */}
                {fieldErrors.selectedDate && (
                  <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs mt-1">
                    <AlertTriangle size={12} />
                    {fieldErrors.selectedDate}
                  </div>
                )}

                {/* NUEVO: Indicador de cambio de fecha en edición */}
                {isEditing &&
                  selectedDate &&
                  originalBookingRef.current?.date &&
                  selectedDate !== originalBookingRef.current.date &&
                  !fieldErrors.selectedDate && (
                    <div className="flex items-center gap-1.5 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-md text-xs mt-1">
                      <Calendar size={12} />
                      <span>
                        📅 Cambiando de {formatLocalDate(originalBookingRef.current.date)} a {formatLocalDate(selectedDate)}
                        {isLoadingSlots && " - Cargando horarios..."}
                      </span>
                    </div>
                  )}

                {/* Mensaje cuando no se ha seleccionado barbero */}
                {!formData.barberId && !fieldErrors.selectedDate && (
                  <div className="flex items-center gap-1.5 p-2 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-md text-xs mt-1">
                    <User size={12} />
                    <span>
                      {currentUser?.role === "barbero"
                        ? "Configurando tu información de barbero..."
                        : "Selecciona un barbero primero"
                      }
                    </span>
                  </div>
                )}

                {/* NUEVO: Feedback positivo cuando mantiene la fecha original */}
                {isEditing &&
                  selectedDate &&
                  originalBookingRef.current?.date &&
                  selectedDate === originalBookingRef.current.date &&
                  !fieldErrors.selectedDate && (
                    <div className="flex items-center gap-1.5 p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-md text-xs mt-1">
                      <CheckCircle size={12} />
                      <span>Manteniendo la fecha original. Puedes cambiar solo la hora si es necesario.</span>
                    </div>
                  )}

                {/* MEJORADO: Mensaje para creación cuando no hay barbero */}
                {!isEditing && selectedDate && !formData.barberId && (
                  <div className="flex items-center gap-1.5 p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-md text-xs mt-1">
                    <Clock size={12} />
                    <span>Fecha seleccionada. Los horarios se mostrarán al seleccionar un barbero.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Hora *
                </label>
                {isEditing && (
                  <div className="flex items-center gap-1.5 p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md text-xs mb-2">
                    <Info size={14} />
                    <span>
                      {selectedDate === originalBookingRef.current?.date ? (
                        <>Horario actual: <strong>{booking?.startTime}</strong>. Puedes cambiar a otro horario disponible.</>
                      ) : (
                        <>Selecciona un nuevo horario para la fecha <strong>{new Date(selectedDate).toLocaleDateString('es-ES')}</strong>.</>
                      )}
                    </span>
                  </div>
                )}
                <select
                  value={selectedTime}
                  onChange={handleTimeChange}
                  disabled={
                    !selectedDate ||
                    isLoadingSlots ||
                    (!isEditing && availableSlots.length === 0)
                  }
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${fieldErrors.selectedTime
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
                >
                  <option value="">
                    {isLoadingSlots
                      ? "Cargando horarios..."
                      : "-- Elige un horario --"}
                  </option>
                  {isEditing &&
                    booking?.startTime &&
                    selectedDate === originalBookingRef.current?.date && (
                      <option
                        value={booking.startTime}
                        className="font-bold bg-blue-900"
                        style={{ backgroundColor: '#1e3a8a' }}
                      >
                        {booking.startTime} - {booking.endTime} ⭐ (Horario actual)
                      </option>
                    )}

                  {/* Mostrar horarios disponibles */}
                  {availableSlots
                    .filter(slot => {
                      if (isEditing && selectedDate === originalBookingRef.current?.date) {
                        return slot.startTime !== booking?.startTime;
                      }
                      return true;
                    })
                    .map((slot) => (
                      <option key={slot.startTime} value={slot.startTime}>
                        {slot.startTime} - {slot.endTime}
                      </option>
                    ))}
                </select>
                {fieldErrors.selectedTime && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {fieldErrors.selectedTime}
                  </p>
                )}
                {selectedDate &&
                  !isLoadingSlots &&
                  availableSlots.length === 0 &&
                  !fieldErrors.selectedTime && (
                    <>
                      {!isEditing ? (
                        // Mensaje para creación
                        <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs mt-1">
                          <AlertTriangle size={12} />
                          <span>No hay horarios disponibles para esta fecha. Prueba con otra fecha.</span>
                        </div>
                      ) : (
                        // Mensaje para edición cuando no hay horarios en nueva fecha
                        selectedDate !== originalBookingRef.current?.date && (
                          <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs mt-1">
                            <Info size={12} />
                            <span>No hay horarios disponibles para esta nueva fecha. Prueba con otra fecha.</span>
                          </div>
                        )
                      )}
                    </>
                  )}
              </div>
            </div>
          </div>

          {/* Estado y Notas */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-600">
              <FileText size={16} className="text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300">
                Estado y Notas
              </h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Estado de la Reserva
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="pendiente">📅 Pendiente</option>
                <option value="confirmada">✅ Confirmada</option>
                <option value="completada">🎉 Completada</option>
                <option value="no-asistio">❌ No Asistió</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Notas adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Añadir cualquier información adicional sobre la reserva, preferencias del cliente, etc..."
                rows="3"
                maxLength="500"
                className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all resize-none ${
                  fieldErrors.notes
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                <div>
                  {fieldErrors.notes && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle size={12} />
                      {fieldErrors.notes}
                    </p>
                  )}
                  {!fieldErrors.notes && (
                    <p className="text-xs text-gray-500">
                      Opcional: Información extra que pueda ser útil para el
                      servicio
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs ${
                    formData.notes.length > 450
                      ? "text-amber-400"
                      : formData.notes.length > 500
                      ? "text-red-400"
                      : "text-gray-500"
                  }`}
                >
                  {formData.notes.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* Error de validación */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3">
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">Error de Validación</p>
                <p className="text-xs text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-500 text-white transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingSlots}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isLoading
                ? "Guardando..."
                : isEditing
                ? "Actualizar Reserva"
                : "Crear Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
