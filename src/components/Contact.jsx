import React from "react";
import { MapPin, Phone, Clock } from "lucide-react";

const Contact = () => {
  // Datos de las sedes
  const sedes = [
    {
      name: "Sede valle grande",
      address: "Yaroslavska 8, Kyiv",
      phone: "+57 304 608 4567",
      hours: "10:00-20:00",
      mapUrl: "https://maps.google.com/?q=Yaroslavska+8,+Kyiv,+Ukraine",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.1234!2d30.5234!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzAwLjQiTiAzMMKwMzEnMjQuMyJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
      gradientFrom: "from-blue-600",
      gradientTo: "to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      name: "Sede Compartir",
      address: "Calle 118 #24-43, Compartir, Cali",
      phone: "+57 301 234 5678",
      hours: "09:00-19:00",
      mapUrl:
        "https://maps.google.com/?q=Calle+118+24-43,+Compartir,+Cali,+Colombia",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.1234!2d-76.5321!3d3.4516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjcnMDUuOCJOIDc2wrAzMSc1NS42Ilc!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
      gradientFrom: "from-red-600",
      gradientTo: "to-red-800",
      hoverShadow: "hover:shadow-red-500/25",
    },
  ];

  const handleMapClick = (mapUrl) => {
    window.open(mapUrl, "_blank");
  };

  return (
    <section
      id="contacto"
      className="relative min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white py-20"
    >
      <div className="container mx-auto px-4 lg:px-10">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="text-white">NUESTRO</span>{" "}
            <span className="text-blue-500">CONTACTO</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Visítanos en cualquiera de nuestras dos sedes. Estamos aquí para
            brindarte el mejor servicio de barbería.
          </p>
        </div>

        {/* Grid de sedes */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          {sedes.map((sede, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl ${sede.hoverShadow} transition-all duration-500 hover:scale-105`}
            >
              {/* Header con gradiente de colores */}
              <div
                className={`bg-gradient-to-br ${sede.gradientFrom} ${sede.gradientTo} p-6`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {sede.name}
                    </h3>
                    <div className="w-20 h-1 bg-white/40 rounded"></div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Información de contacto */}
                <div className="space-y-6 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Dirección</p>
                      <p className="text-gray-300">{sede.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Teléfono</p>
                      <a
                        href={`tel:${sede.phone}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        {sede.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Horarios</p>
                      <p className="text-gray-300">{sede.hours}</p>
                    </div>
                  </div>
                </div>

                {/* Mapa interactivo */}
                <div className="mb-8">
                  <div
                    className="relative h-56 rounded-xl overflow-hidden cursor-pointer group/map shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleMapClick(sede.mapUrl)}
                  >
                    <iframe
                      src={sede.embedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="pointer-events-none filter brightness-90 group-hover/map:brightness-100 transition-all duration-300"
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/map:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-gradient-to-r from-blue-600 via-white to-red-500 text-black px-6 py-3 rounded-lg font-bold shadow-lg transform translate-y-4 group-hover/map:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Abrir en Google Maps</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
