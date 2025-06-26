import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { CircleUserRound, CircleCheckBig } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import apiService from "../api/services";
import RedirectNotice from "../components/RedirectNotice";

const BarberScreen = () => {
  const [barbers, setBarbers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookingDetails, setBarber } = useBooking();
  const navigate = useNavigate();

  if (!bookingDetails.service) {
    // Si falta el servicio (el primer paso de todos), lo mandamos ahí.
    return (
      <RedirectNotice
        message="Para continuar, primero debes seleccionar un servicio."
        redirectTo="/reservar"
      />
    );
  }
    if (!bookingDetails.site) {
      return (
      <RedirectNotice
        message="Para elegir un barbero, primero debes seleccionar una sede."
        redirectTo="/reservar/sede"
      />
    );
    }

    const fetchBarbers = async () => {
      console.log(
        `Iniciando la carga de barberos para la sede: ${bookingDetails.site.name_site}`
      );
      setIsLoading(true);
      setError(null);
      try {
        const siteId = bookingDetails.site._id;
        const data = await apiService.getBarbersBySite(siteId);
        console.log("Barberos recibidos:", data);
        setBarbers(data);
      } catch (err) {
        console.error("Error al cargar los barberos:", err);
        setError(err.message || "No se pudieron cargar los barberos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBarbers();
  }, [bookingDetails.site, navigate]);

  // Filtramos los barberos basados en la sede seleccionada en el paso anterior.
  // const availableBarbers = useMemo(()=>
  //     barbers.filter(barber => barber.siteId === bookingDetails.site?._id)
  // );

  const handleContinue = () => {
    navigate("/reservar/fecha-hora");
    //alert('Navegando a la selección de disponibilidad de barbero (aún no implementada)');
  };

  const handleBack = () => {
    navigate(-1);
  };

  // --- Renderizado Condicional ---
  // if (error) {
  //   return (
  //     <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
  //       <ProgressBar currentStep={3} />
  //       <p className="text-red-500 text-xl mt-8">Error: {error}</p>
  //     </div>
  //   );
  // }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
            Paso 3: Elige tu Barbero
          </span>
        </h2>

        <ProgressBar currentStep={3} />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-grow gap-6">
            <Spinner />
            <p className="text-xl text-gray-300">Cargando servicios...</p>
          </div>
        ) : barbers.length > 0 ? (
          <div className="flex flex-col gap-6">
            {barbers.map((barber) => {
              const isSelected = bookingDetails.barber?._id === barber._id;

              const cardClasses = `
              relative bg-gray-800 border-2 rounded-lg p-4 cursor-pointer flex items-center gap-4
              transition-all duration-300 ease-in-out transform hover:scale-105
              ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/50"
                  : "border-gray-700 hover:border-blue-600"
              }
            `;

              return (
                <div
                  key={barber._id}
                  className={cardClasses}
                  onClick={() => setBarber(barber)}
                >
                  <img
                    src={barber.imageUrl}
                    alt={barber.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-600"
                  />
                  <p className="flex-grow text-xl font-bold text-white">
                    {barber.name}
                  </p>
                  {isSelected && (
                    <CircleCheckBig className="h-8 w-8 text-blue-400" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            No hay barberos disponibles para esta sede
          </div>
        )}

        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBack}
            className="w-full sm:w-1/3 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform border-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Anterior
          </button>
          <button
            onClick={handleContinue}
            disabled={!bookingDetails.barber}
            className="w-full sm:w-2/3 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform bg-gradient-to-r from-blue-600 to-red-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarberScreen;
