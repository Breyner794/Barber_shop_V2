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

    // --- DEBUG 10: Entrando al useEffect de carga de slots ---
    // console.log("DEBUG 10: Entrando al useEffect de carga de slots.");
    // console.log("  Dependencias:");
    // console.log("    formData.barberId:", formData.barberId);
    // console.log("    selectedDate:", selectedDate);
    // console.log("    isEditing:", isEditing);
    // console.log("    booking?.startTime (en dependencias):", booking?.startTime);
    // console.log("    originalBookingRef.current:", originalBookingRef.current);

    let shouldFetchSlots = false;
    if (!isEditing) {
      // Para creación, siempre que haya barbero y fecha
      shouldFetchSlots = Boolean(formData.barberId && selectedDate);
    } else {
      // Para edición, solo si el barbero o la fecha seleccionados son DIFERENTES a los originales
      // (lo que implica un reagendamiento intencional)
      if (originalBookingRef.current) {
        const hasBarberChanged = formData.barberId.toString() !== originalBookingRef.current.barberId.toString();
        const hasDateChanged = (selectedDate === originalBookingRef.current.date || selectedDate !== originalBookingRef.current.date); // !== no mostraba los demas slots porque si era igual osea devolveria un true si son el mismo tipo pero no iguales
        shouldFetchSlots = hasBarberChanged || hasDateChanged;
        // --- DEBUG 11: Detalles de cambio para shouldFetchSlots en edición ---
        // console.log("DEBUG 11: Lógica de shouldFetchSlots en edición:");
        // console.log("  hasBarberChanged:", hasBarberChanged);
        // console.log("  hasDateChanged:", hasDateChanged);
        // console.log("  shouldFetchSlots (calculado):", shouldFetchSlots);

      } else {
          
          shouldFetchSlots = false; // Prevents initial fetch in edit if no changes
      }
    }

    const fetchSlots = async () => {
       // --- DEBUG 12: Iniciando fetch de slots ---
      // console.log(
      //   `DEBUG 12: Iniciando fetch de slots para Barbero: ${formData.barberId}, Fecha: ${selectedDate}`
      // );
      if (shouldFetchSlots) {
        setIsLoadingSlots(true);
        setError(null);
        try {
          const responseData = await apiService.getAvailableSlotsForBooking(
            formData.barberId,
            selectedDate
          );
          setAvailableSlots(responseData || []);
          // --- DEBUG 13: Slots recibidos ---
        console.log("DEBUG 13: Slots recibidos:", responseData);

          const isSelectedTimeValidAndAvailable = (responseData || []).some(
            (slot) => slot.startTime === selectedTime
          );

          // --- DEBUG 14: Validación de selectedTime después de fetch ---
        console.log(
          "DEBUG 14: isSelectedTimeValidAndAvailable:",
          responseData
        );
        console.log("  selectedTime actual:", selectedTime);

          // if (!isSelectedTimeValidAndAvailable && responseData.length > 0) {
          //   setSelectedTime(responseData[0].startTime);
          //   console.log("DEBUG 14: selectedTime actualizado a primer slot:", responseData[0].startTime);
          // } else if (!isSelectedTimeValidAndAvailable && responseData.length === 0) {
          //   setSelectedTime("");
          //   // console.log("DEBUG 14: selectedTime vaciado (no hay slots).");
          // } REVISAR LOGICA NO FUNCIONA PARA CUANDO SE VAYA A EDITAR ALGO.
         
        } catch (apiError) {
          // console.error("DEBUG ERROR: Error al cargar los horarios disponibles:", apiError);
          // console.error("Error al cargar los horarios disponibles:", apiError);
          setError(
            "No se pudieron cargar los horarios para esta fecha y barbero."
          );
          setAvailableSlots([]);
          setSelectedTime(""); // Limpiar selectedTime si hay error
        } finally {
          setIsLoadingSlots(false);
          //console.log("DEBUG 15: Carga de slots finalizada. isLoadingSlots:", false);
        }
      } else {
        setAvailableSlots([]);
      }
    };

    fetchSlots();
   
  }, [formData.barberId, selectedDate, isEditing, booking?.startTime, originalBookingRef.current]);

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
const validateDateTime = () => {
  const errors = { ...fieldErrors };
  
  // Validar fecha
  if (!selectedDate) {
    errors.selectedDate = 'Debes seleccionar una fecha';
  } else {
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDateObj < today) {
      errors.selectedDate = 'No puedes seleccionar una fecha pasada'; //REVISARRRRRRRR
    } else {
      // Validar que no sea más de 6 meses en el futuro
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 3);
      
      if (selectedDateObj > sixMonthsLater) {
        errors.selectedDate = 'No puedes programar reservas con más de 3 meses de anticipación';
      } else {
        delete errors.selectedDate;
      }
    }
  }

  // Validar hora
  if (!selectedTime) {
    if (selectedDate) {
      errors.selectedTime = 'Debes seleccionar una hora';
    }
  } else {
    // Validar que la hora seleccionada esté disponible
    const isTimeAvailable = availableSlots.some(slot => slot.startTime === selectedTime);
    const isOriginalTime = isEditing && booking?.startTime === selectedTime;
    
    if (!isTimeAvailable && !isOriginalTime) {
      errors.selectedTime = 'La hora seleccionada ya no está disponible';
    } else {
      delete errors.selectedTime;
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
  setSelectedDate(e.target.value);
  setSelectedTime("");
  
  // Limpiar errores de hora cuando cambia la fecha
  const errors = { ...fieldErrors };
  delete errors.selectedTime;
  setFieldErrors(errors);
  
  if (error) {
    setError(null);
  }

  // Validar fecha después de un breve delay
  setTimeout(() => {
    validateDateTime();
  }, 100);
};

  const handleTimeChange = (e) => {
  setSelectedTime(e.target.value);
  
  if (error) {
    setError(null);
  }

  // Validar hora después de un breve delay
  setTimeout(() => {
    validateDateTime();
  }, 100);
};

const validateForm = () => {
  let hasErrors = false;
  const errors = {};

  // Validar todos los campos
  const fieldsToValidate = ['clientName', 'clientPhone', 'barberId', 'serviceId', 'siteId', 'notes'];
  
  fieldsToValidate.forEach(field => {
    const value = formData[field] || '';
    if (!validateField(field, value)) {
      hasErrors = true;
    }
  });

  // Validar fecha y hora
  if (!validateDateTime()) {
    hasErrors = true;
  }

  // Validaciones especiales para edición vs creación
  if (!isEditing) {
    if (!selectedDate || !selectedTime) {
      setError("Por favor, selecciona una fecha y hora para la reserva.");
      return false;
    }
  } else {
    const hasRescheduleIntent =
      formData.barberId.toString() !== originalBookingRef.current?.barberId.toString() ||
      selectedDate !== originalBookingRef.current?.date;

    if (hasRescheduleIntent && (!selectedDate || !selectedTime)) {
      setError("Por favor, selecciona una nueva fecha y hora para el reagendamiento.");
      return false;
    }
  }

  // Validar que hay al menos un horario disponible si se requiere
  if (selectedDate && selectedTime && availableSlots.length === 0 && !isEditing && !isLoading) {
    setError("No hay horarios disponibles para la fecha seleccionada. Por favor, elige otra fecha.");
    return false;
  }

  if (hasErrors) {
    // Mostrar el primer error encontrado
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
                  <div className="flex items-center gap-1.5 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-md text-xs mb-2">
                    <AlertTriangle size={14} />
                    <span>Cambiar fecha requerirá elegir nueva hora.</span>
                  </div>
                )}
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={minDateForInput}
                  disabled={!formData.barberId}
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.selectedDate
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                />
                {fieldErrors.selectedDate && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {fieldErrors.selectedDate}
                  </p>
                )}
                {!formData.barberId && !fieldErrors.selectedDate && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Selecciona un barbero primero
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Hora *
                </label>
                {isEditing && (
                  <div className="flex items-center gap-1.5 p-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-md text-xs mb-2">
                    <AlertTriangle size={14} />
                    <span>Solo verás slots si cambias fecha/barbero.</span>
                  </div>
                )}
                <select
                value={selectedTime}
                  onChange={handleTimeChange}
                  disabled={
                    !selectedDate ||
                    isLoadingSlots ||
                    (availableSlots.length === 0 &&
                      (!isEditing || selectedTime !== booking?.startTime))
                  }
                  className={`w-full bg-gray-700 text-white p-3 rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.selectedTime
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }`}
                >
                  <option value="">
                    {isLoadingSlots
                      ? "Cargando horarios..."
                      : "-- Seleccionar Hora --"}
                  </option>
                  {isEditing &&
                    booking?.startTime &&
                    selectedTime === booking?.startTime &&
                    !availableSlots.some(
                      (slot) => slot.startTime === booking?.startTime
                    ) && (
                      <option
                        value={booking.startTime}
                        disabled
                        className="text-gray-500"
                      >
                        {booking.startTime} (Original - No disponible)
                      </option>
                    )}
                  {availableSlots.map((slot) => (
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
                    <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-xs mt-1">
                      <AlertTriangle size={12} />
                      <span>
                        No hay horarios disponibles para esta fecha. Prueba con
                        otra fecha.
                      </span>
                    </div>
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
