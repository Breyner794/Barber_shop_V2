import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import {MapPin, CircleCheckBig} from "lucide-react"
import ProgressBar from "../components/ProgressBar";
import apiService from "../api/services";
import SiteScreenSkeleton from "../components/Skeleton/SiteScreenSkeleton";
import ErrorComponent from "../components/ErrorComponent";
import RedirectNotice from "../components/RedirectNotice";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SiteScreen = () =>{
  
    const [sites, setSites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { bookingDetails, setSite } = useBooking();
    const navigate = useNavigate();

    if (!bookingDetails.service) {
      return(
        <RedirectNotice 
        message="Para continuar, primero debes seleccionar un servicio."
        redirectTo="/reservar"
        />
        )
      }

    useEffect(()=>{
      const fetchSites = async () =>{
        console.log(
          'Iniciando carga de las sedes desde la API'
        );
        setIsLoading(true);
        setError(null)
        try {  
          const response = await apiService.getAllSite(); // Assuming apiService.getAllSite() returns a response object with a data property
          const data = response.data || [];
          setSites(data)
        } catch (err) {
          setError(err.message );
        } finally {
          setIsLoading(false);
        }
      };
      fetchSites();
    },[]);

    const handleContinue = () => {
        navigate('/reservar/barbero');
    };

    const handleRetry = () => {
    window.location.reload(); // La forma más simple de reintentar.
    };
    
    const handleBack = () =>{
    navigate(-1);
    };

    // --- Renderizado Condicional ---
  if (isLoading) {
    return (
      <SiteScreenSkeleton/>
    );
  }

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
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
            <span className="text-transparent bg-clip-text bg-white">
              Paso 2: Elige la Sede
            </span>
          </h2>
        </div>

        <ProgressBar currentStep={2} />

        <div className="space-y-4 mb-8 lg:mb-12">
          {sites.map((site) => {
            const isSelected = bookingDetails.site?._id === site._id;

            const cardClasses = `
                  relative bg-black/50 backdrop-blur-sm border-2 rounded-xl p-6 cursor-pointer 
                  flex items-center gap-6 transition-all duration-300 ease-in-out 
                  transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 
              ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/50 "
                  : "border-gray-700 hover:border-blue-600"
              }
            `;

            return (
              <div
                key={site._id}
                className={cardClasses}
                onClick={() => setSite(site)}
              >
                <MapPin className="h-10 w-10 text-red-500" />
                <div className="flex-grow">
                  <p className="text-xl font-bold text-white">
                    {site.name_site}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    {site.address_site}
                  </p>
                </div>
                {isSelected && (
                  <CircleCheckBig className="h-8 w-8 text-blue-400" />
                )}
              </div>
            );
          })}
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

          {/* Botón Continuar */}
          <button
            onClick={handleContinue}
            disabled={!bookingDetails.site || sites.length === 0}
            className="group relative w-full py-4 px-6 text-lg rounded-lg bg-red-600 text-white font-extrabold 
               transition-all duration-500 hover:shadow-xl focus:outline-none overflow-hidden
               disabled:bg-red-600 disabled:cursor-not-allowed disabled:hover:shadow-none"
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

export default SiteScreen;