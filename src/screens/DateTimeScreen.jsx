import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import ProgressBar from "../components/ProgressBar";
import apiService from "../api/services";
import Spinner from "../components/Spinner";
import DateTimeScreenSkeleton from "../components/Skeleton/DateTimeScreenSkeleton";
import InlineError from "../components/InlineError";
import RedirectNotice from "../components/RedirectNotice";

const DateTimeScreen = () => {
  const { bookingDetails, setTimeSlot } = useBooking();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null); // Almacena la fecha ELEGIDA (ej: '2025-06-17')
  const [availableSlots, setAvailableSlots] = useState([]); // Almacena los horarios devueltos por la API
  const [selectedSlot, setSelectedSlot] = useState(null); // Almacena el horario ELEGIDO (ej: {startTime, endTime})
  const [isPageLoading ,setIsPageLoading] = useState(true) //Para recargar toda la pagina y mostrar el skeleton
  const [isLoading, setIsLoading] = useState(false); // Para mostrar un indicador de carga Spinner
  const [error, setError] = useState(null); // Para mostrar errores

  const upcomingDays = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)),
    []
  );

  if (!bookingDetails.service){
    return(
      <RedirectNotice 
      message="Primero debes seleccionar un servicio." 
      redirectTo="/reservar" 
      />
    );
  }
  if (!bookingDetails.site){
    return(
      <RedirectNotice 
      message="Ahora debes seleccionar una sede para continuar." 
      redirectTo="/reservar/sede" 
      />
    );
  }
  if (!bookingDetails.barber){
    return(
      <RedirectNotice 
      message="Ahora debes seleccionar un barbero para continuar." 
      redirectTo="/reservar/barbero" 
      />
    );
  }

  useEffect(() => {
    setTimeout(() => {
      setIsPageLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedDate && bookingDetails.barber) {
      const fecthAvailableSlots = async () => {
        setIsLoading(true);
        setAvailableSlots([]);
        setSelectedSlot(null);
        setError(null);

        try {
          const barberId = bookingDetails.barber._id;
          const data = await apiService.getAvailableSlotsForBooking(
            barberId,
            selectedDate
          );

          if (Array.isArray(data)) {
            console.log(
              "Datos recibidos y es un arreglo. Actualizando estado:",
              data
            );
            setAvailableSlots(data);
          } else {
            
            console.warn(
              "La API no devolvió un arreglo de horarios. Se recibió:",
              data
            );
            setAvailableSlots([]); 
          }
        } catch (err) {
          console.error("Error al cargar los horarios:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fecthAvailableSlots();
    }
  }, [selectedDate, bookingDetails.barber, navigate]);

  const handleSelectDate = (date) => {
    const formatteDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formatteDate);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot),
      setTimeSlot({
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
  };

  const handleRetry = () => {
    window.location.reload(); // La forma más simple de reintentar.
  };

  const handleContinue = () => {
    navigate("/reservar/confirmacion"); // Próximo paso
    //alert('Navegando a la pantalla de Confirmación (aún no implementada)');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isPageLoading){
    return (
      <DateTimeScreenSkeleton/>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
            Paso 4: Elige Fecha y Hora
          </span>
        </h2>

        <ProgressBar currentStep={4} />

        {/* Sección de Selección de Fecha */}
        <div className="mb-8">
          <p className="font-bold mb-4 text-lg">Selecciona una fecha:</p>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {upcomingDays.map((day) => {
              const dayString = format(day, "yyyy-MM-dd");
              const isSelected = selectedDate === dayString;
              return (
                <button
                  key={dayString}
                  onClick={() => handleSelectDate(day)}
                  className={`flex-shrink-0 text-center p-4 rounded-lg w-24 transition-all duration-200
                              ${
                                isSelected
                                  ? "bg-blue-600 text-white scale-105"
                                  : "bg-gray-800 hover:bg-gray-700"
                              }`}
                >
                  <p className="font-bold text-sm capitalize">
                    {format(day, "EEE", { locale: es })}
                  </p>
                  <p className="font-black text-2xl">{format(day, "d")}</p>
                  <p className="text-xs capitalize">
                    {format(day, "MMM", { locale: es })}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sección de Selección de Hora */}
        {selectedDate && (
          <div>
            <p className="font-bold mb-4 text-lg">
              Horarios disponibles para el{" "}
              {format(
                new Date(selectedDate + "T00:00:00"),
                "eeee, d 'de' MMMM",
                { locale: es }
              )}
              :
            </p>
            {isLoading && (
              <div className="flex flex-col items-center justify-center flex-grow gap-6">
                <Spinner />
                <p className="text-center text-gray-400">
                  Buscando horarios...
                </p>
              </div>
            )}
            {error && !isLoading && (
              <InlineError message={error} onRetry={handleRetry} />
              )}
            {!isLoading && !error && availableSlots.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.startTime}
                    onClick={() => handleSelectSlot(slot)}
                    className={`p-3 rounded-lg text-center font-bold transition-all duration-200
                                ${
                                  selectedSlot?.startTime === slot.startTime
                                    ? "bg-gradient-to-r from-blue-600 to-red-600 scale-105"
                                    : "bg-gray-800 hover:bg-gray-700"
                                }`}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
            {!isLoading && !error && availableSlots.length === 0 && (
              <div className="text-center bg-gray-800 p-6 rounded-lg">
                <p className="font-bold">No hay horarios disponibles</p>
                <p className="text-gray-400">
                  Por favor, selecciona otra fecha.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer con botones */}
        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBack}
            className="w-full sm:w-1/3 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Anterior
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedSlot} // Deshabilitado si no hay FECHA Y HORA seleccionadas
            className="w-full sm:w-2/3 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
            bg-gradient-to-r from-blue-600 via-white to-red-600 text-black 
            hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 
            disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimeScreen;