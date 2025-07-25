import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import apiService from "../api/services"; 

// Importa los íconos de Lucide React que vamos a usar
import { Loader2, AlertTriangle, PackageX, LoaderCircle } from "lucide-react";


const COLOR_VARIANTS = {
  blue: {
    gradient: "from-blue-600 via-blue-500 to-blue-700",
    cardBg: "from-slate-900/90 via-blue-900/20 to-slate-900/90",
    border: "border-blue-400/30 hover:border-blue-300/60",
    shadow: "hover:shadow-blue-400/25",
    button:
      "from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:via-blue-600 hover:to-blue-800",
    text: "text-blue-400",
    accent: "bg-blue-500/20",
  },
  red: {
    gradient: "from-red-600 via-red-500 to-red-700",
    cardBg: "from-slate-900/90 via-red-900/20 to-slate-900/90",
    border: "border-red-400/30 hover:border-red-300/60",
    shadow: "hover:shadow-red-400/25",
    button:
      "from-red-600 via-red-500 to-red-700 hover:from-red-700 hover:via-red-600 hover:to-red-800",
    text: "text-red-400",
    accent: "bg-red-500/20",
  },
  gold: {
    gradient: "from-yellow-600 via-yellow-400 to-yellow-600",
    cardBg: "from-slate-900/90 via-yellow-900/20 to-slate-900/90",
    border: "border-yellow-400/40 hover:border-yellow-300/70",
    shadow: "hover:shadow-yellow-400/30",
    button:
      "from-yellow-600 via-yellow-500 to-yellow-700 hover:from-yellow-700 hover:via-yellow-600 hover:to-yellow-800",
    text: "text-yellow-400",
    accent: "bg-yellow-500/20",
  },
};

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  const navigate = useNavigate();
  const { setService, bookingDetails } = useBooking();

  const AUTO_SCROLL_INTERVAL = 4000;

  // Función para determinar el color basado en el precio
  const getServiceColor = (price) => {
    if (price < 20000) {
      return "blue";
    } else if (price < 30000) {
      return "red";
    } else {
      return "gold";
    }
  };

  // Efecto para cargar los servicios desde la API
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getAllServices(); 

        const servicesArray = Array.isArray(response.data) ? response.data : [];

        const formattedServices = servicesArray.map((service) => ({
            id: service._id, 
            name: service.name,
            price: service.price,
            duration: service.duration,
            description: service.description,
            image: service.image_Url || "/default-service-image.png",
            color: getServiceColor(service.price),
            isActive: service.isActive,
        }));
        setServicesData(formattedServices);

        if (bookingDetails.service && formattedServices.length > 0) {
            const selectedIndex = formattedServices.findIndex(s => s.id === bookingDetails.service._id);
            if (selectedIndex !== -1) {
                setCurrentIndex(selectedIndex);
            }
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        let userFriendlyMessage = "¡Oops! No pudimos cargar los servicios.";
        
        if (err.response) {
          userFriendlyMessage = err.response.data?.message || `Error del servidor: ${err.response.status}.`;
        } else if (err.request) {
          userFriendlyMessage = "¡Ups! No pudimos conectar con el servidor. Revisa tu conexión a internet.";
        } else if (err.message) {
          userFriendlyMessage = err.message;
        }
        setError(userFriendlyMessage);
        setServicesData([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); 

  useEffect(() => {
    if (isPaused || servicesData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % servicesData.length);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, servicesData]); 

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % servicesData.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + servicesData.length) % servicesData.length
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleReserveNow = (service) => {
    setService(service); 
    navigate("/reservar"); 
  };

  return (
    <section
      id="servicios"
      className="relative min-h-screen bg-gradient-to-t from-gray-900 via-blue-700 to-gray-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        {/* Header*/}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="text-white">NUESTROS</span>{" "}
            <span className="text-blue-200">SERVICIOS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Ofrecemos servicios de barbería de alta calidad con técnicas
            tradicionales y modernas
          </p>
        </div>

        {/* --- Renderizado Condicional Mejorado para Carga, Error y Sin Servicios --- */}
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-800/70 rounded-xl shadow-lg my-10 animate-fade-in">
            <LoaderCircle className="w-20 h-20 text-blue-400 mb-6 animate-spin" /> 
            <p className="text-2xl sm:text-3xl font-bold text-blue-300 mb-3">Cargando nuestros servicios...</p>
            <p className="text-xl text-gray-400 max-w-xl text-center">Estamos preparando la mejor experiencia de estilo para ti. ¡Un momento por favor!</p>
          </div>
        ) : error ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 text-center my-10 animate-fade-in">
            <AlertTriangle className="w-20 h-20 text-red-500 mb-6 animate-bounce-slow" /> 
            <p className="text-2xl sm:text-3xl font-bold text-red-400 mb-4">
              ¡Lo sentimos, algo salió mal!
            </p>
            <p className="text-xl text-gray-300 mb-8 max-w-xl">
              Detalle del error: <strong>{error}</strong> Por favor, inténtalo de nuevo más tarde o contacta con soporte si el problema persiste.
            </p>
            <button
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-md text-lg"
            >
              Reintentar
            </button>
          </div>
        ) : servicesData.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-gray-800/70 backdrop-blur-sm shadow-lg my-12 animate-fade-in">
            <PackageX className="w-20 h-20 text-yellow-400 mb-6 animate-pulse-slow" /> 
            <p className="text-2xl sm:text-3xl text-white mb-4 font-bold">
              ¡Aún no hay servicios disponibles!
            </p>
            <p className="text-xl text-gray-200 max-w-xl text-center">
              Estamos trabajando arduamente para añadir nuevas experiencias de estilo. ¡Vuelve pronto o contáctanos para más información!
            </p>
          </div>
        ) : (
          /* Carrusel principal (solo se renderiza si hay datos y no hay error) */
          <div className="relative max-w-6xl mx-auto">
            {/* Controles de navegación - Posicionados fuera de las tarjetas */}
            <button
              onClick={goToPrev}
              className="absolute left-0 sm:-left-8 lg:-left-16 top-1/2 -translate-y-1/2 z-30 group bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-3 sm:p-4 lg:p-5 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:text-blue-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 sm:-right-8 lg:-right-16 top-1/2 -translate-y-1/2 z-30 group bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-3 sm:p-4 lg:p-5 transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:text-blue-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Contenedor del carrusel */}
            <div 
              className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl mx-4 sm:mx-8 lg:mx-16"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {servicesData.map((service) => {
                  const colors = COLOR_VARIANTS[service.color];
                  return (
                    <div
                      key={service.id} 
                      className="w-full flex-shrink-0"
                    >
                      <div
                        className={`group relative bg-gradient-to-br ${colors.cardBg} backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 border ${colors.border} transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${colors.shadow} overflow-hidden`}
                      >
                        {/* Elemento decorativo de fondo */}
                        <div
                          className={`absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 ${colors.accent} rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`}
                        ></div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                          {/* Imagen del servicio */}
                          <div className="relative order-1 lg:order-1">
                            <div className="overflow-hidden rounded-xl sm:rounded-2xl shadow-2xl">
                              <img
                                src={service.image} 
                                alt={service.name}
                                className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                          </div>

                          {/* Información del servicio */}
                          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
                            <div>
                              <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black mb-3 sm:mb-4 tracking-tight">
                                <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                                  {service.name}
                                </span>
                              </h3>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div
                                  className={`px-4 sm:px-6 py-2 sm:py-3 ${colors.accent} rounded-xl sm:rounded-2xl border ${colors.border}`}
                                >
                                  <span
                                    className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black ${colors.text}`}
                                  >
                                    {formatPrice(service.price)}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-slate-400">
                                  <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  <span className="text-sm sm:text-base lg:text-lg font-semibold">
                                    {service.duration} min
                                  </span>
                                </div>
                              </div>
                            </div>

                            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
                              {service.description}
                            </p>

                            <button
                              onClick={() => handleReserveNow(service)}
                              className={`w-full bg-gradient-to-r ${colors.button} text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 transform shadow-xl hover:shadow-2xl text-sm sm:text-base lg:text-lg tracking-wide`}
                            >
                              RESERVAR AHORA
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Indicadores  */}
            <div className="flex justify-center mt-8 lg:mt-12 space-x-2 sm:space-x-3">
              {servicesData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 sm:w-12 h-3 sm:h-4 bg-gradient-to-r from-blue-500 via-white to-red-500 shadow-lg"
                      : "w-3 sm:w-4 h-3 sm:h-4 bg-slate-600 hover:bg-slate-500 hover:scale-110"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;