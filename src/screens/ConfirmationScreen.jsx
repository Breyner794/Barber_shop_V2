import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {BriefcaseBusiness, MapPin, CircleUserRound, CalendarRange, Clock } from 'lucide-react'
import ProgressBar from "../components/ProgressBar";
import apiService from '../api/services';
import Spinner from '../components/Spinner';
import ConfirmationScreenSkeleton from '../components/Skeleton/ConfirmationScreenSkeleton';
import RedirectNotice from '../components/RedirectNotice';
import Alert from '../components/Alert';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const ConfirmationScreen = () => {
    const { bookingDetails, resetBooking} = useBooking();
    const navigate = useNavigate();

    const [clientInfo, setClientInfo] = useState({name: '', phone: '', email: ''});
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(()=>{
      setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
    },[])

    if (!bookingDetails.service) {
          return (
            <RedirectNotice
              message="Primero debes seleccionar un servicio."
              redirectTo="/reservar"
            />
          );
        }
        if (!bookingDetails.site) {
          return (
            <RedirectNotice
              message="Ahora debes seleccionar una sede para continuar."
              redirectTo="/reservar/sede"
            />
          );
        }
        if (!bookingDetails.barber) {
          return (
            <RedirectNotice
              message="Ahora debes seleccionar un barbero para continuar."
              redirectTo="/reservar/barbero"
            />
          );
        }
        if(!bookingDetails.date){
          return (
            <RedirectNotice 
              message="Ahora debes de seleccionar una fecha y hora" 
              redirectTo="/reservar/fecha-hora" 
            />
          );
        };

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientInfo(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
          }
  };

  const validateForm = () => {
        const errors = {};
        if (!clientInfo.name.trim()) {
            errors.name = 'El nombre es obligatorio.';
        }
        if (!clientInfo.phone.trim()) {
            errors.phone = 'El teléfono es obligatorio.';
        } else if (!/^\d{10}$/.test(clientInfo.phone.trim())) {
            errors.phone = 'Formato de teléfono no válido (solo números, 10 dígitos).';
        }
        if (clientInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email.trim())) {
            errors.email = 'Formato de correo electrónico no válido.';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Retorna true si no hay errores
    };

  const handleBack = () => navigate(-1);

  const handleConfirm = async () => {

    if (!validateForm()) {
            setError("Por favor, corrige los errores en el formulario.");
            return;
        }

    setIsLoading(true);
    setError(null);
    try{

      const finalBookingData = {
        serviceId: bookingDetails.service._id,
        siteId: bookingDetails.site._id,
        barberId: bookingDetails.barber._id,
        date: bookingDetails.date,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        clientEmail: clientInfo.email,
      };

      console.log("Enviando datos de la reserva a la API:", finalBookingData);

        const response = await apiService.createAppointment(finalBookingData);
        Swal.fire({
          icon: "success",
          title: '<span style="font-size: 24px;">¡Reserva Confirmada!</span>',
          html: `
    <div style="text-align: left; margin-top: 20px;">
        <p style="margin-bottom: 15px;">Gracias, <strong>${response.clientName}</strong>. Tu cita ha sido agendada con éxito.</p>
        <p style="margin-bottom: 25px;">Usa el siguiente código para consultar tu reserva:</p>
        
        <div style="background-color: #1F2937; color: #E5E7EB; padding: 15px; border-radius: 8px; border: 2px dashed #4B5563; text-align: center;">
            <span style="font-size: 14px; letter-spacing: 1px; display: block; margin-bottom: 5px;">Tu código de confirmación</span>
            <strong style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #60A5FA;">${response.confirmationCode}</strong>
        </div>
        
        <div style="
            background-color: #3F2913; /* Un naranja-marrón oscuro, para un fondo de advertencia más sutil */
            color: #FFDDAA; /* Tono más cálido y claro para el texto */
            padding: 15px;
            border-radius: 8px;
            border: 2px dashed #F59E0B; /* Borde punteado naranja más claro, como advertencia */
            margin-top: 25px;
            font-size: 14px;
            text-align: center;
        ">
            <p style="font-weight: bold; margin-bottom: 5px; font-size: 16px;">¡ATENCIÓN: Cita sujeta a puntualidad!</p>
            <p style="margin-bottom: 5px;">Si llegas <strong>10 minutos tarde</strong>, tu reserva será marcada como "No Asistió".</p>
            <p>Por favor, llega a tiempo para no perder tu cita. ¡Gracias!</p>
        </div>
    </div>
`,
          confirmButtonText: "¡Excelente!",
          confirmButtonColor: "#2563EB",
          allowOutsideClick: false,
          background: "#111827",
          color: "#FFFFFF",
        }).then((result) => {
          if (result.isConfirmed) {
            resetBooking();
            navigate("/reserva-exitosa", {
              replace: true, // Para que el usuario no pueda volver a la pantalla de confirmación
              state: { booking: response },
            });
          }
        });

    }catch (err) {
       // 4. Manejamos cualquier error que la API nos devuelva.
       console.error("Error al confirmar la reserva:", err);
            // Mostrar el mensaje de error de la API si existe, de lo contrario un mensaje genérico
            setError(err.message || "Ocurrió un error al procesar tu reserva. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

   // Prevenimos renderizar si los detalles no están listos
  if (!bookingDetails.service) return null;

  if(isPageLoading){
    return(
      <ConfirmationScreenSkeleton/>
    )
  }

return (
  <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
    <Header />
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
          <span className="text-transparent bg-clip-text bg-white">
            Paso Final: Confirma tus Datos
          </span>
        </h2>

        <ProgressBar currentStep={5} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna del Formulario */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-l-4 border-red-500 pl-4">
              Completa tus datos
            </h3>
            <div className="space-y-4 text-black">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={clientInfo.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/80 border-2 border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
                />
                {validationErrors.name && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.name}</p>
                                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={clientInfo.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/80 border-2 border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
                />
                {validationErrors.phone && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.phone}</p>
                                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={clientInfo.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/80 border-2 border-gray-700 rounded-lg p-3 focus:border-blue-500 focus:ring-blue-500 transition"
                />
                {validationErrors.email && (
                                    <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                                )}
              </div>
            </div>
          </div>

          {/* Columna del Resumen */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold border-l-4 border-blue-500 pl-4">
              Resumen de tu reserva
            </h3>
            <div className="bg-black/50 p-6 rounded-lg space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[280px] text-center">
                  <Spinner />
                  <p className="mt-4 text-lg font-semibold text-gray-200">
                    Confirmando tu reserva...
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Estamos asegurando tu espacio. ¡Un momento, por favor!
                  </p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-4">
                    <BriefcaseBusiness className="h-6 w-6 text-blue-500" />
                    <span>
                      <strong>Servicio:</strong> {bookingDetails.service.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-red-500" />
                    <span>
                      <strong>Sede:</strong> {bookingDetails.site.name_site}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CircleUserRound className="h-6 w-6 text-blue-500" />
                    <span>
                      <strong>Barbero:</strong> {bookingDetails.barber.name}{" "}
                      {bookingDetails.barber.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CalendarRange className="h-6 w-6 text-red-500" />
                    <span>
                      <strong>Fecha:</strong>{" "}
                      {format(
                        new Date(bookingDetails.date + "T00:00:00"),
                        "EEEE, d 'de' MMMM",
                        { locale: es }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-blue-400" />
                    <span>
                      <strong>Hora:</strong> {bookingDetails.startTime}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            )}
          </div>
        </div>

        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4">
          {/* Botón Anterior */}
          <button
            onClick={handleBack}
            className="w-full sm:w-1/3 py-3 px-6 text-lg font-bold rounded-lg 
               border-2 border-gray-400 text-gray-300 bg-transparent
               hover:bg-white hover:text-black hover:border-gray-300
               transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Anterior
          </button>

          <button
            onClick={handleConfirm}
            disabled={!clientInfo.name || !clientInfo.phone || isLoading || Object.keys(validationErrors).length > 0}
            className="group relative w-full py-4 px-6 text-lg rounded-lg bg-red-600 text-white font-extrabold 
               transition-all duration-500 hover:shadow-xl focus:outline-none overflow-hidden
               disabled:bg-red-600 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <span className="relative z-10 group-hover:text-black transition-colors duration-500">
              Confirmar reserva
            </span>
            {/* Gradiente en hover */}
            <div
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 via-white to-red-600 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out
                    disabled:group-hover:opacity-0"
            ></div>
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);
};

export default ConfirmationScreen;