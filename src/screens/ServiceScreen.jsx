import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CircleCheckBig } from "lucide-react";
import ProgressBar from '../components/ProgressBar';
import apiService from '../api/services'
import ServiceScreenSkeleton from '../components/Skeleton/ServiceScreenSkeleton';
import ErrorComponent from '../components/ErrorComponent';
import Header from "../components/Header";
import Footer from "../components/Footer";

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
        const data = await apiService.getAllServices();
        setServices(data);
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
                  <img
                    src={service.image_Url}
                    alt={service.name}
                    className="w-full h-48 object-cover" // La imagen ocupa todo el ancho, tiene altura fija y no se deforma
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

          {/* Botón Continuar */}
          <div className="relative group  mb-8 lg:mb-12">
            <button
              onClick={handleContinue}
              disabled={!bookingDetails.service || services.length === 0}
              className="w-full py-4 px-6 text-lg rounded-lg  bg-red-600 text-white font-extrabold transition-all duration-500 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed focus:outline-none"
            >
              <span className="relative z-10 group-hover:text-black transition-color duration-500">
                Continuar
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-700 via-white to-red-600  opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceScreen;