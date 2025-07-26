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
import Header from "../components/Header";
import Footer from "../components/Footer";

const DateTimeScreen = () => {
  const { bookingDetails, setTimeSlot } = useBooking();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null); // Almacena la fecha ELEGIDA (ej: '2025-06-17')
  const [availableSlots, setAvailableSlots] = useState([]); // Almacena los horarios devueltos por la API
  const [selectedSlot, setSelectedSlot] = useState(null); // Almacena el horario ELEGIDO (ej: {startTime, endTime})
  const [isPageLoading, setIsPageLoading] = useState(true); //Para recargar toda la pagina y mostrar el skeleton
  const [isLoading, setIsLoading] = useState(false); // Para mostrar un indicador de carga Spinner
  const [error, setError] = useState(null); // Para mostrar errores

  const upcomingDays = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1)),
    []
  );

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

  if (isPageLoading) {
    return <DateTimeScreenSkeleton />;
  }

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            <span className="text-transparent bg-clip-text bg-white">
              Paso 4: Elige Fecha y Hora
            </span>
          </h2>

          <ProgressBar currentStep={4} />

          {/* Sección de Selección de Fecha */}
          <div className="mb-8">
            <p className="font-bold mb-4 text-lg">Selecciona una fecha:</p>
            <div
              className="flex overflow-x-auto space-x-4 pb-4
              scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-blue-500
              hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full"
            >
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
                                  ? "bg-blue-200/30 text-white scale-105"
                                  : "bg-black/50 hover:bg-gray-700"
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
              <p className="font-bold mb-6 text-lg">
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
                <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <h3 className="text-center font-bold text-white mb-6 text-lg">
                    Horas disponibles:
                  </h3>

                  <div className="grid grid-cols-3 gap-6">
                    {/* MAÑANA */}
                    <div className="text-center">
                      <h4 className="font-bold text-white mb-4 text-base border-b border-white/20 pb-2">
                        MAÑANA
                      </h4>
                      <div className="space-y-2">
                        {availableSlots
                          .filter((slot) => {
                            const hour = parseInt(slot.startTime.split(":")[0]);
                            return hour >= 6 && hour < 12;
                          })
                          .map((slot) => (
                            <button
                              key={slot.startTime}
                              onClick={() => handleSelectSlot(slot)}
                              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
                              ${
                                selectedSlot?.startTime === slot.startTime
                                  ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                                  : "bg-black/50 text-white border-white/20 hover:bg-black/70 hover:border-white/30"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          ))}
                        {availableSlots.filter((slot) => {
                          const hour = parseInt(slot.startTime.split(":")[0]);
                          return hour >= 6 && hour < 12;
                        }).length === 0 && (
                          <p className="text-gray-400 text-sm italic py-4">
                            Sin horas para reservar
                          </p>
                        )}
                      </div>
                    </div>

                    {/* TARDE */}
                    <div className="text-center">
                      <h4 className="font-bold text-white mb-4 text-base border-b border-white/20 pb-2">
                        TARDE
                      </h4>
                      <div className="space-y-2">
                        {availableSlots
                          .filter((slot) => {
                            const hour = parseInt(slot.startTime.split(":")[0]);
                            return hour >= 12 && hour < 18;
                          })
                          .map((slot) => (
                            <button
                              key={slot.startTime}
                              onClick={() => handleSelectSlot(slot)}
                              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
                              ${
                                selectedSlot?.startTime === slot.startTime
                                  ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                                  : "bg-black/50 text-white border-white/20 hover:bg-black/70 hover:border-white/30"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          ))}
                        {availableSlots.filter((slot) => {
                          const hour = parseInt(slot.startTime.split(":")[0]);
                          return hour >= 12 && hour < 18;
                        }).length === 0 && (
                          <p className="text-gray-400 text-sm italic py-4">
                            Sin horas para reservar
                          </p>
                        )}
                      </div>
                    </div>

                    {/* NOCHE */}
                    <div className="text-center">
                      <h4 className="font-bold text-white mb-4 text-base border-b border-white/20 pb-2">
                        NOCHE
                      </h4>
                      <div className="space-y-2">
                        {availableSlots
                          .filter((slot) => {
                            const hour = parseInt(slot.startTime.split(":")[0]);
                            return hour >= 18 || hour < 6;
                          })
                          .map((slot) => (
                            <button
                              key={slot.startTime}
                              onClick={() => handleSelectSlot(slot)}
                              className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border
                              ${
                                selectedSlot?.startTime === slot.startTime
                                  ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                                  : "bg-black/50 text-white border-white/20 hover:bg-black/70 hover:border-white/30"
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          ))}
                        {availableSlots.filter((slot) => {
                          const hour = parseInt(slot.startTime.split(":")[0]);
                          return hour >= 18 || hour < 6;
                        }).length === 0 && (
                          <p className="text-gray-400 text-sm italic py-4">
                            Sin horas para reservar
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && !error && availableSlots.length === 0 && (
                <div className="text-center bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-white mb-2">
                    No hay horarios disponibles
                  </p>
                  <p className="text-gray-400">
                    Por favor, selecciona otra fecha.
                  </p>
                </div>
              )}
            </div>
          )}

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

            {/* Botón Continuar */}
            <button
              onClick={handleContinue}
              disabled={!bookingDetails.service}
              className="group relative w-full py-4 px-6 text-lg rounded-lg bg-red-600 text-white font-extrabold 
               transition-all duration-500 hover:shadow-xl focus:outline-none overflow-hidden
               disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                Continuar
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

export default DateTimeScreen;