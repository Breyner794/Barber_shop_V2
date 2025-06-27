import React, { useState } from "react";

// Datos del equipo
const teamMembers = [
  {
    id: 1,
    name: "Carlos Gómez",
    description:
      "Especialista en cortes clásicos y modernos con más de 8 años de experiencia.",
    image: "/barbero1.jpg",
    sede: "Sede 1",
  },
  {
    id: 2,
    name: "Sebastian Castillo",
    description:
      "Creativo en tendencias actuales y técnicas de coloración con 6 años de trayectoria.",
    image: "/barbero2.jpg",
    sede: "Sede 2",
  },
  {
    id: 3,
    name: "Brayan Pérez",
    description:
      "Innovador en estilos únicos y tratamientos capilares con enfoque personalizado.",
    image: "/barbero3.jpg",
    sede: "Sede 2",
  },
  {
    id: 4,
    name: "Gregory López",
    description:
      "Maestro en técnicas tradicionales de barbería y arreglo de barba con 10 años de experiencia.",
    image: "/barbero4.jpg",
    sede: "Sede 1",
  },
];

// Componente FlipCard individual con estado
const FlipCard = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative h-[500px] w-full">
      <div
        className="relative h-full w-full cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative h-full w-full transition-transform duration-700 rounded-2xl shadow-2xl"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Parte frontal */}
          <div
            className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="relative h-full w-full bg-black">
              {/* Imagen que ocupa todo el contenedor */}
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Overlay gradient sutil para mejor legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

              {/* Nombre en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6">
                <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                  {member.name}
                </h3>
                <p className="text-white/80 text-sm">Toca para ver más</p>
              </div>
            </div>
          </div>

          {/* Parte trasera - Información */}
          <div
            className="absolute inset-0 h-full w-full rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="relative h-full w-full bg-white">
              {/* Fondo con patrón sutil */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-600"></div>


              {/* Botón de cerrar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors z-10"
              >
                ✕
              </button>

              {/* Contenido */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
                <div className="text-center max-w-sm">

                  {/* Nombre */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {member.name}
                  </h3>

                  {/* Sede */}
                  <div className="inline-block bg-gradient-to-r from-blue-500 via-white to-red-500 text-black px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-md">
                    {member.sede}
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {member.description}
                  </p>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal Team
const Team = () => {
  return (
    <section
      id="team"
      className="relative min-h-screen bg-gradient-to-t from-red-950 via-red-500 to-black text-white py-20"
    >
      <div className="container mx-auto px-4 lg:px-10">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="text-white">NUESTRO</span>{" "}
            <span className="text-red-500">EQUIPO</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Profesionales expertos con años de experiencia listos para brindarte
            el mejor servicio
          </p>
        </div>

        {/* Grid del equipo con flip cards estilo red social */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {teamMembers.map((member) => (
            <FlipCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
