import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { CircleUserRound, CircleCheckBig } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import apiService from "../api/services";
import SkeletonScreenBarber from "../components/Skeleton/BarbersScreenSkeleton";
import RedirectNotice from "../components/RedirectNotice";
import ErrorComponent from "../components/ErrorComponent";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

  useEffect(() => {
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
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBarbers();
  }, [bookingDetails.site, navigate]);

  const handleContinue = () => {
    navigate("/reservar/fecha-hora");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading){
    return (
      <SkeletonScreenBarber/>
    )
  }

  const handleRetry = () => {
    window.location.reload(); // La forma más simple de reintentar.
  };

  // --- Renderizado Condicional ---
  if (error) {
    return(
      <ErrorComponent message={error} onRetry={handleRetry}/>
    )
}

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
            <span className="text-transparent bg-clip-text bg-white">
              Paso 3: Elige tu Barbero
            </span>
          </h2>

          <ProgressBar currentStep={3} />

          <div className="flex flex-col gap-6">
            {barbers.map((barber) => {
              const isSelected = bookingDetails.barber?._id === barber._id;

              const cardClasses = `
                  relative bg-black/50 backdrop-blur-sm border-2 rounded-xl p-6 cursor-pointer 
                  flex items-center gap-6 transition-all duration-300 ease-in-out 
                  transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 
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
                  <div className="flex-grow">
                    <p className=" text-xl font-bold text-white">
                      {barber.name} {barber.last_name}
                    </p>
                    <p className=" text-sm text-gray-400">
                      {barber.site_barber.name_site}
                    </p>
                  </div>
                  {isSelected && (
                    <CircleCheckBig className="h-8 w-8 text-blue-400" />
                  )}
                </div>
              );
            })}
          </div>

          {!isLoading && !error && barbers.length === 0 && (
            <div className="text-center bg-gray-800 p-6 rounded-lg">
              <p className="font-bold">
                No hay barberos disponibles para esta sede
              </p>
              <p className="text-gray-400">Por favor, selecciona otra sede.</p>
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

export default BarberScreen;
