import React, { useState } from "react";

const Gallery = () => {

  const redirectToInstragram = (URL) =>{
    window.location.href = URL
  }
  // Array de imágenes galeria
  const galleryImages = [
    {
      id: 1,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825880/Imagen_de_WhatsApp_2025-09-01_a_las_17.27.06_2915da37_z9t0h0.jpg",
      title: "Estilo Clásico Elegante",
      description: "Por Junior Castillo",
      category: "corte-clasico",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825879/Imagen_de_WhatsApp_2025-09-01_a_las_17.27.05_2b166a0c_feulqz.jpg",
      title: "Estilo Clásico Elegante",
      description: "Por Junior Castillo",
      category: "corte-clasico",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825878/Imagen_de_WhatsApp_2025-09-01_a_las_17.27.06_d19f275e_wlrk2q.jpg",
      title: "Estilo Clásico Elegante",
      description: "Por Junior Castillo",
      category: "corte-clasico",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 4,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825877/Imagen_de_WhatsApp_2025-09-01_a_las_17.27.06_36d63cc1_bfzdek.jpg",
      title: "Estilo Clásico Elegante",
      description: "Por Junior Castillo",
      category: "corte-clasico",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 5,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756826104/Imagen_de_WhatsApp_2025-09-01_a_las_17.17.39_4b38627e_ucwm9o.jpg",
      title: "Corte Sencillos",
      description: "Por Junior Castillo",
      category: "corte-sencillo",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 6,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756826101/Imagen_de_WhatsApp_2025-09-01_a_las_17.19.06_25f7e051_igjdl1.jpg",
      title: "Corte Sencillos",
      description: "Por Junior Castillo",
      category: "corte-sencillo",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 7,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756826100/Imagen_de_WhatsApp_2025-09-01_a_las_17.16.47_6ef13b42_yhgdlb.jpg",
      title: "Corte Sencillos",
      description: "Por Junior Castillo",
      category: "corte-sencillo",
      gradient: "from-blue-600 to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25",
    },
    {
      id: 8,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825940/Imagen_de_WhatsApp_2025-09-01_a_las_17.23.59_f1e7f710_mabwzi.jpg",
      title: "Cortes con Diseños Personalizados",
      description: "Por Junior Castillo",
      category: "corte-diseño",
      gradient: "from-red-600 to-red-800",
      hoverShadow: "hover:shadow-red-500/25",
    },
    {
      id: 9,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825938/Imagen_de_WhatsApp_2025-09-01_a_las_17.23.59_9c2f0c7f_aeqhkb.jpg",
      title: "Cortes con Diseños Personalizados",
      description: "Por Junior Castillo",
      category: "corte-diseño",
      gradient: "from-green-600 to-green-800",
      hoverShadow: "hover:shadow-green-500/25",
    },
    {
      id: 10,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825937/Imagen_de_WhatsApp_2025-09-01_a_las_17.23.18_0e42f579_atrhcc.jpg",
      title: "Cortes con Diseños Personalizados",
      description: "Por Junior Castillo",
      category: "corte-diseño",
      gradient: "from-green-600 to-green-800",
      hoverShadow: "hover:shadow-green-500/25",
    },
    {
      id: 11,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825935/Imagen_de_WhatsApp_2025-09-01_a_las_17.19.53_02db3d11_iiqe5x.jpg",
      title: "Cortes con Diseños Personalizados",
      description: "Por Junior Castillo",
      category: "corte-diseño",
      gradient: "from-green-600 to-green-800",
      hoverShadow: "hover:shadow-green-500/25",
    },
    {
      id: 12,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825846/Imagen_de_WhatsApp_2025-08-28_a_las_14.42.59_51a9ed50_iilxdm.jpg",
      title: "Barba de Caballero",
      description: "Por Junior Castillo",
      category: "barba",
      gradient: "from-orange-600 to-orange-800",
      hoverShadow: "hover:shadow-orange-500/25",
    },
    {
      id: 13,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825846/Imagen_de_WhatsApp_2025-08-28_a_las_14.38.54_aba8a43d_exprgw.jpg",
      title: "Barba de Caballero",
      description: "Por Junior Castillo",
      category: "barba",
      gradient: "from-orange-600 to-orange-800",
      hoverShadow: "hover:shadow-orange-500/25",
    },
    {
      id: 14,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825847/Imagen_de_WhatsApp_2025-08-28_a_las_14.40.00_e53cdfb5_xdlo3k.jpg",
      title: "Barba de Caballero",
      description: "Por Junior Castillos",
      category: "barba",
      gradient: "from-yellow-600 to-yellow-800",
      hoverShadow: "hover:shadow-yellow-500/25",
    },
    {
      id: 15,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825432/Imagen_de_WhatsApp_2025-09-01_a_las_17.15.38_84821141_qdzq6m.jpg",
      title: "Fade Profesional",
      description: "Por Junior Castillo",
      category: "fade",
      gradient: "from-yellow-600 to-yellow-800",
      hoverShadow: "hover:shadow-yellow-500/25",
    },
    {
      id: 16,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825432/Imagen_de_WhatsApp_2025-09-01_a_las_17.14.00_0991683c_lan99u.jpg",
      title: "Fade Profesional",
      description: "Por Junior Castillo",
      category: "fade",
      gradient: "from-yellow-600 to-yellow-800",
      hoverShadow: "hover:shadow-yellow-500/25",
    },
    {
      id: 17,
      image: "https://res.cloudinary.com/dibpc6jxc/image/upload/v1756825432/Imagen_de_WhatsApp_2025-09-01_a_las_17.14.40_efa85a7b_w3an5x.jpg",
      title: "Fade Profesional",
      description: "Por Junior Castillo",
      category: "fade",
      gradient: "from-yellow-600 to-yellow-800",
      hoverShadow: "hover:shadow-yellow-500/25",
    },
  ];

  // Categorías para los filtros de galeria
  const galleryCategories = {
    todos: "Todos",
    "corte-sencillo": "Cortes Sencillos",
    "corte-clasico": "Cortes Clásicos",
    "corte-diseño": "Cortes con Diseños",
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
            <button
            onClick={() => redirectToInstragram ('https://www.instagram.com/caba.llerosdelsenor?igsh=ZnpxMWJwcHVuY3Nu')} 
            className="bg-gradient-to-r from-blue-600 via-white to-red-500 text-black font-bold py-4 px-8 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg cursor-pointer">
              Ver Más Trabajos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
