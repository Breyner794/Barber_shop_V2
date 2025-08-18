import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Scissors } from 'lucide-react';

const Barber404Page = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    // Crear elementos flotantes para la animación
    const elements = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 0.5,
      duration: 3 + Math.random() * 2
    }));
    setFloatingElements(elements);
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos flotantes decorativos */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute opacity-20 text-blue-400 "
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${element.duration}s ease-in-out infinite`,
            animationDelay: `${element.delay}s`
          }}
        >
          <Scissors size={24 + Math.random() * 24} />
        </div>
      ))}

      {/* Contenido principal */}
      <div className={`text-center max-w-2xl mx-auto transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        
        {/* Icono principal animado */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-blue-800 rounded-full shadow-2xl shadow-blue-900/50 animate-bounce">
            <Scissors className="w-16 h-16 md:w-20 md:h-20 text-white animate-pulse" />
          </div>
          
          {/* Círculos decorativos */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-4 -left-0 w-6 h-6 bg-blue-300 rounded-full animate-pulse"></div>
        </div>

        {/* Título 404 */}
        <div className="mb-6">
          <h1 className="text-8xl md:text-9xl font-bold text-blue-300 mb-4 animate-bounce">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto rounded-full mb-4"></div>
        </div>

        {/* Mensaje principal */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ¡Oops! Esta página se fue a cortar el pelo
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-2">
            Parece que la página que buscas no existe o se mudó a otra barbería.
          </p>
        </div>

        {/* Botón de navegación */}
        <div className="max-w-xs mx-auto mb-8">
          <button
            onClick={() => handleNavigation('/home')}
            className="group flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-800/40"
          >
            <Home size={24} className="group-hover:animate-pulse" />
            <span className="text-lg">Volver al Inicio</span>
          </button>
        </div>

        {/* Botón volver */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Volver atrás
          </button>
        </div>

        {/* Mensaje adicional */}
        <div className="mt-12 p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-blue-800/30 shadow-lg shadow-blue-900/20">
          <p className="text-sm text-gray-300 mb-2">
            <strong className="text-blue-400">¿Necesitas ayuda?</strong>
          </p>
          <p className="text-sm text-gray-400">
            Contacta con nosotros y te ayudaremos a encontrar exactamente lo que buscas.
          </p>
        </div>
      </div>

      {/* Estilos para animaciones personalizadas */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Barber404Page;