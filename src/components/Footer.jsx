import React from "react";
import { Phone, MapPin, Clock, HelpCircle } from "lucide-react";
import SocialMediaLinks from "./SocialMedia";

const Footer = () => {

  const handleFAQClick = () => {
    window.open('/Faq', '_blank');
  };

  return (
    <footer className="bg-black text-white">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-white to-red-600"></div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-red-500 mb-4">
              Caballeros del Señor
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Comprometidos con la excelencia y el servicio desde 2010. Nuestra
              misión es brindar calidad y confianza en cada proyecto.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
              Contacto
            </h4>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>+57 312 456 5678</span>
              </div>
            </div>
            {/* Redes sociales responsivas */}
            <div className="flex justify-start md:justify-start mt-2">
              <SocialMediaLinks position="footer" theme="light" size="medium" />
            </div>
          </div>

          {/* Sedes */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
              Sedes
            </h4>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white">Sede Principal</p>
                  <p>Calle 123 #45-67, Cali</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white">Sede Norte</p>
                  <p>Carrera 89 #12-34, Cali</p>
                </div>
              </div>
            </div>
          </div>

          {/* Horarios y FAQ */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-4 border-b border-gray-700 pb-2">
              Horarios
            </h4>
            <div className="space-y-2 text-sm text-gray-300 mb-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="font-medium text-white">Lun - Vie:</span>
                <span>9:00 - 20:00</span>
              </div>
              <div className="flex items-center space-x-3 ml-7">
                <span className="font-medium text-white">Sábado:</span>
                <span>8:00 - 18:00</span>
              </div>
              <div className="flex items-center space-x-3 ml-7">
                <span className="font-medium text-white">Festivos:</span>
                <span>10:00 - 16:00</span>
              </div>
            </div>

            {/* FAQ Botón mejorado */}
            <div className="mt-6">
              <button
                onClick={handleFAQClick}
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600/20 to-red-600/20 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center px-4 py-3 space-x-2">
                  <HelpCircle className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                  <span className="font-semibold text-sm text-blue-400 group-hover:text-blue-300 transition-colors duration-300 tracking-wide">
                    FAQ
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Caballeros del Señor. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
