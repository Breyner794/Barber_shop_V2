import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import {MapPin, CircleCheckBig} from "lucide-react"
import ProgressBar from "../components/ProgressBar";
import apiService from "../api/services";
import SiteScreenSkeleton from "../components/Skeleton/SiteScreenSkeleton";
import ErrorComponent from "../components/ErrorComponent";
import RedirectNotice from "../components/RedirectNotice";

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
          const data = await apiService.getAllSite();
          setSites(data);
        } catch (err) {
          setError(err.message );
        } finally {
          setIsLoading(false);
        }
      };
      fetchSites();
    },[]);

    const { bookingDetails, setSite } = useBooking();
    const navigate = useNavigate();

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
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
            Paso 2: Elige la Sede
          </span>
        </h2>

        <ProgressBar currentStep={2}/>
        
        <div className="flex flex-col gap-6">
          {sites.map((site) => {
            const isSelected = bookingDetails.site?._id === site._id;
            
            const cardClasses = `
              relative bg-gray-800 border-2 rounded-lg p-6 cursor-pointer flex items-center gap-6
              transition-all duration-300 ease-in-out transform hover:scale-105
              ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 hover:border-blue-600'}
            `;

            return (
              <div
                key={site._id}
                className={cardClasses}
                onClick={() => setSite(site)}
              >
                <MapPin className="h-10 w-10 text-red-500" />
                <div className="flex-grow">
                  <p className="text-xl font-bold text-white">{site.name_site}</p>
                  <p className="text-sm text-gray-400 mt-1">{site.address_site}</p>
                </div>
                {isSelected && (
                  <CircleCheckBig className="h-8 w-8 text-blue-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer con dos botones: Anterior y Continuar */}
        <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleBack}
            className="w-full sm:w-1/3 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
                       border-2 border-gray-600 text-gray-300 
                       hover:bg-gray-700 hover:text-white"
          >
            Anterior
          </button>
          <button
            onClick={handleContinue}
            disabled={!bookingDetails.site}
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

export default SiteScreen;