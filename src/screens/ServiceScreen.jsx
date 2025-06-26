import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { CircleCheckBig } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import apiService from '../api/services'
import Spinner from '../components/Spinner';

// Datos de ejemplo actualizados con imágenes
// const mockServices = [
//   { id: '1', nombre: 'Corte de Cabello', duracion: 40, precio: 20000, image_Url: '../../public/barba1.jpg' },
//   { id: '2', nombre: 'Corte y Barba', duracion: 60, precio: 16000, image_Url: '../../public/barba2.jpg' },
//   { id: '3', nombre: 'Afeitado Clásico', duracion: 40, precio: 18000, image_Url: '../../public/barbero2.jpg' },
//   { id: '4', nombre: 'Tratamiento Capilar', duracion: 60, precio: 22000, image_Url: '../../public/corteClasico1.jpg' },
// ];

const ServiceScreen = () => {

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { bookingDetails, setService } = useBooking();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchServices = async () => {
      console.log ("Iniciando carga de servicios desde la API...");
      try{
        const data = await apiService.getAllServices();
        setServices(data);
      }catch (error){
        console.error("Error al cargar servicios:", err);
        setError(err.message || "No se pudieron cargar los servicios.");
      }finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);


  const handleContinue = () => {
    navigate('/reservar/sede');
  };

   // --- Renderizado Condicional ---
  if (isLoading) {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <ProgressBar currentStep={1} />
      <div className="flex flex-col items-center justify-center flex-grow gap-6">
        <Spinner /> {/* <-- 2. Usa el componente Spinner */}
        <p className="text-xl text-gray-300">Cargando servicios...</p>
      </div>
    </div>
  );
}

  if (error) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
        <ProgressBar currentStep={1} />
        <p className="text-red-500 text-xl mt-8">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500">
            Paso 1: Elige tu Servicio
          </span>
        </h2>
        
        <ProgressBar currentStep={1}/> 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isSelected = bookingDetails.service?._id === service._id;
            
            const cardClasses = `
              relative bg-gray-800 border-2 rounded-lg cursor-pointer flex flex-col
              transition-all duration-300 ease-in-out transform hover:scale-105 overflow-hidden
              ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-700 hover:border-blue-600'}
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
                    <p className="text-xl font-bold text-white">{service.name}</p>
                    <p className="text-sm text-gray-400 mt-1">{service.duration} Minutos aprox.</p>
                  </div>
                  <p className="text-2xl font-semibold text-white mt-4 self-end">
                    {`$${service.price.toLocaleString('es-CO')}`}
                  </p>
                </div>

                {isSelected && (
                  <CircleCheckBig className="absolute top-4 right-4 h-6 w-6 text-blue-400" /> //////////////////////
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 lg:mt-12">
          <button
            onClick={handleContinue}
            disabled={!bookingDetails.service}
            className="w-full py-4 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
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

export default ServiceScreen;