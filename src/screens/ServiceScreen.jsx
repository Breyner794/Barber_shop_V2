import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CircleCheckBig, Lock, ArrowRight } from "lucide-react";
import ProgressBar from '../components/ProgressBar';
import apiService from '../api/services'
import ServiceScreenSkeleton from '../components/Skeleton/ServiceScreenSkeleton';
import ErrorComponent from '../components/ErrorComponent';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServiceImage from '../components/Dashboard/Services/servicesImage';

const ServiceScreen = () => {

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookingDetails, setService } = useBooking();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchServices = async () => {
      console.log ("Iniciando carga de servicios desde la API...");
      setIsLoading(true);
      setError(null);
      try{
        const response = await apiService.getAllServices();
        const data = response.data || []
        setServices(data);
        if (bookingDetails.service && data.length > 0) {
          const preselectedService = data.find(s => s._id === bookingDetails.service._id);
          if (preselectedService) {
          }
        }
      }catch (err){
        setError(err.message);
      }finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleRetry = () => {
    window.location.reload(); // La forma más simple de reintentar.
  };

  const handleContinue = () => {
    navigate('/reservar/sede');
  };

  const isDisabled = !bookingDetails.service || services.length === 0;

   // --- Renderizado Condicional ---
  if (isLoading) {
   return <ServiceScreenSkeleton />;
}

  if (error) {
    return(
    <ErrorComponent message={error} onRetry={handleRetry} />
    )
}

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6 lg:pt-10 ">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
            <span className="text-transparent bg-clip-text bg-white">
              Paso 1: Elige tu Servicio
            </span>
          </h2>

          <ProgressBar currentStep={1} />

          {services.length === 0 ? (
            <div className="text-center py-10 px-6 rounded-lg bg-gray-800/70 backdrop-blur-sm shadow-lg my-12">
              <p className="text-xl text-white mb-4 font-bold">
                ¡No hay servicios disponibles en este momento!
              </p>
              <p className="text-gray-200">
                Nuestro equipo está trabajando para añadir nuevas opciones. ¡Vuelve pronto!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 lg:mb-12">
              {services.map((service) => {
                const isSelected = bookingDetails.service?._id === service._id;

                const cardClasses = `
                relative bg-black/50 border-2 rounded-lg cursor-pointer flex flex-col
                transition-all duration-300 ease-in-out transform hover:scale-105 overflow-hidden
                ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/50"
                    : "border-gray-700 hover:border-blue-600"
                }
                `;

                return (
                  <div
                    key={service._id}
                    className={cardClasses}
                    onClick={() => setService(service)}
                  >
                    {/* --- SECCIÓN DE LA IMAGEN --- */}
                    <ServiceImage
                      src={service.image_Url}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />

                    {/* --- SECCIÓN DEL TEXTO --- */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <p className="text-xl font-bold text-white">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {service.duration} Minutos aprox.
                        </p>
                      </div>
                      <p className="text-2xl font-semibold text-white mt-4 self-end">
                        {`$${service.price.toLocaleString("es-CO")}`}
                      </p>
                    </div>

                    {isSelected && (
                      <CircleCheckBig className="absolute top-4 right-4 h-6 w-6 text-blue-400" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Botón Continuar */}
          {/* Variante 3: Con efecto de pulso cuando está disabled */}
        <div className="relative group">
          <button
            onClick={handleContinue}
            disabled={isDisabled}
            className={`
              w-full py-4 px-6 text-lg rounded-lg font-extrabold 
              transition-all duration-300 relative overflow-hidden
              ${isDisabled 
                ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-500 cursor-not-allowed border-2 border-gray-600' 
                : 'bg-red-600 text-white hover:shadow-xl'
              }
            `}
          >
            <span className={`
              relative z-10 flex items-center justify-center gap-2
              ${!isDisabled && 'group-hover:text-black transition-colors duration-500'}
            `}>
              {isDisabled && <Lock className="w-5 h-5" />}
              {isDisabled ? 'Selecciona un servicio' : 'Continuar'}
              {!isDisabled && <ArrowRight className="w-5 h-5" />}
            </span>
            
            {!isDisabled && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-700 via-white to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
            )}

            {/* Efecto de pulso sutil cuando está disabled */}
            {isDisabled && (
              <div className="absolute inset-0 rounded-lg bg-gray-600/20 animate-pulse" />
            )}
          </button>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceScreen;