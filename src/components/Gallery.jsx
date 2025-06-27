import React, { useState } from "react";

const Gallery = () => {
  // Array de imágenes galeria
  const galleryImages = [
    {
      id: 1,
      image: "/corteClasico1.jpg",
      title: "Estilo Clásico Elegante",
      description: "Por Carlos Gómez",
      category: "corte-clasico",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 2,
      image: "/moderno1.jpg",
      title: "Estilo Urbano",
      description: "Por Sebastian Castillo",
      category: "corte-moderno",
      gradient: "from-red-600 to-red-800",
      hoverShadow: "hover:shadow-red-500/25",
    },
    {
      id: 3,
      image: "/barba1.jpg",
      title: "Barba Perfecta",
      description: "Por Gregory López",
      category: "barba",
      gradient: "from-green-600 to-green-800",
      hoverShadow: "hover:shadow-green-500/25",
    },
    {
      id: 4,
      image: "/fade1.jpg",
      title: "Fade Profesional",
      description: "Por Brayan Pérez",
      category: "fade",
      gradient: "from-purple-600 to-purple-800",
      hoverShadow: "hover:shadow-purple-500/25",
    },
    {
      id: 5,
      image: "/corteClasico2.jpg",
      title: "Corte Ejecutivo",
      description: "Por Carlos Gómez",
      category: "corte-clasico",
      gradient: "from-blue-700 to-blue-900",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 6,
      image: "/fade2.jpg",
      title: "High Fade",
      description: "Por Gregory López",
      category: "fade",
      gradient: "from-orange-600 to-orange-800",
      hoverShadow: "hover:shadow-orange-500/25",
    },
    {
      id: 7,
      image: "/moderno2.jpg",
      title: "Corte Moderno",
      description: "Por Sebastian Castillo",
      category: "corte-moderno",
      gradient: "from-teal-600 to-teal-800",
      hoverShadow: "hover:shadow-teal-500/25",
    },
    {
      id: 8,
      image: "/barba2.jpg",
      title: "Barba de Caballero",
      description: "Por Brayan Pérez",
      category: "barba",
      gradient: "from-yellow-600 to-yellow-800",
      hoverShadow: "hover:shadow-yellow-500/25",
    },
  ];

  // Categorías para los filtros de galeria
  const galleryCategories = {
    todos: "Todos",
    "corte-clasico": "Cortes Clásicos",
    "corte-moderno": "Cortes Modernos",
    barba: "Barbas",
    fade: "Fade",
  };

  // Estado para controlar la categoría seleccionada de la galeria
  const [activeCategory, setActiveCategory] = useState("todos");

  // Filtrar imágenes de la galeria según la categoría activa
  const filteredImages =
    activeCategory === "todos"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <section
      id="galeria"
      className="relative min-h-screen bg-gradient-to-t from-black via-white to-black text-white py-20"
    >
      <div className="container mx-auto px-4 lg:px-10">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            <span className="text-white">NUESTROS</span>{" "}
            <span className="text-yellow-500">TRABAJOS</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubre nuestros mejores trabajos y encuentra la inspiración para
            tu próximo estilo
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(galleryCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`filter-btn px-6 py-3 font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg ${
                activeCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                  : "bg-black hover:bg-blue-600 text-white"
              }`}
            >
              {galleryCategories[category]}
            </button>
          ))}
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredImages.map((item) => (
            <div
              key={item.id}
              className={`gallery-item ${item.category} group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl ${item.hoverShadow} transition-all duration-500 hover:scale-105`}
            >
              <div className="aspect-square relative">
                {/* Si hay imagen, mostrarla; si no, mostrar placeholder con gradiente */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Si la imagen no carga, mostrar el placeholder
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Placeholder con gradiente (se muestra si no hay imagen o si falla la carga) */}
                <div
                  className={`aspect-square bg-gradient-to-br ${
                    item.gradient
                  } flex items-center justify-center ${
                    item.image ? "hidden" : ""
                  }`}
                  style={{ display: item.image ? "none" : "flex" }}
                >
                  <div className="text-center">
                    <span className="text-white font-semibold">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Overlay con información */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-black via-transparent to-blue-600/20 rounded-2xl p-8 backdrop-blur-sm border">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¿Te gustó algún estilo?
            </h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Reserva tu cita y deja que nuestros expertos recreen el estilo
              perfecto para ti
            </p>
            <button className="bg-gradient-to-r from-blue-600 via-white to-red-500 text-black font-bold py-4 px-8 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg">
              Ver Más Trabajos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
