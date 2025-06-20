import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MapPin, Phone, Mail, Clock,Calendar, Scissors, Users, Camera, Info,HelpCircle } from "lucide-react";

function Barbershop() {
  const [isOpen, setIsOpen] = useState(false);

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

  // Array de imágenes galeria
  const galleryImages = [
    {
      id: 1,
      image: "/corteClasico1.jpg", // Ruta de la imagen
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
    <div className="min-h-screen bg-black">
      {/* HEADER*/}
      <header className="relative z-30 px-4 lg:px-10 py-6 bg-black backdrop-blur-sm">
        <nav className="hidden lg:flex items-center justify-center w-full">
          {/* Logo centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-40 h-20 bg-gradient-to-r from-blue-600 via-white to-red-500 rounded-lg flex items-center justify-center text-black font-bold text-xl drop-shadow-lg">
              <img src="/logo-tipo-barber.svg" alt="" />
            </div>
          </div>

          {/* Menú distribuido */}
          <div className="flex w-full justify-between items-center max-w-6xl mx-auto">
            <div className="flex gap-8 font-medium">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  // Scroll al inicio de la página
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-white hover:text-blue-400 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                HOME
              </a>
              <a
                href="#reservas"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("reservas");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-white hover:text-red-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                <Link to={'/reservar'}>RESERVAS</Link>
              </a>
              <a
                href="#servicios"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("servicios");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-white hover:text-blue-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                SERVICIOS
              </a>
            </div>
            <div className="w-20"></div> {/* Espaciador para el logo */}
            <div className="flex gap-8 font-medium">
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("contacto");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-white hover:text-red-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                SEDES
              </a>
              <a
                href="#galeria"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("galeria");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-white hover:text-blue-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                GALERÍA
              </a>
              <a
                href="#nosotros"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("nosotros");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="text-white hover:text-blue-400 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                NOSOTROS
              </a>
            </div>
          </div>
        </nav>

        {/* HEADER MOVIL */}
        <div className="lg:hidden flex justify-between items-center">
          {/* Logo centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/logo-tipo-barber.svg"
              alt="Logo"
              className="w-40 h-40 object-contain brightness-0 invert drop-shadow-lg"
            />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 via-white to-red-500 p-0.5 shadow-lg hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Menú móvil */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black via-gray-900 to-black text-white z-40 transition-all duration-300">
          {/* Header del menú */}
          <div className="flex justify-between items-center p-6 border-b border-white">
            <div className="flex items-center gap-3">
              <Scissors className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-white to-red-500 bg-clip-text text-transparent">
                MENÚ PRINCIPAL
              </h2>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition-colors flex items-center justify-center"
            >
              <X className="w-6 h-6 text-red-400" />
            </button>
          </div>

          {/* Navegación principal */}
          <nav className="p-6 space-y-8 text-xl font-semibold">
            {[
              {
                name: "Reservas",
                icon: Calendar,
                color: "text-blue-500",
                href: "/reservar",
              },
              {
                name: "Nuestros Servicios",
                icon: Scissors,
                color: "text-red-500",
                href: "#servicios",
              },
              {
                name: "Nuestro Team",
                icon: Users,
                color: "text-green-500",
                href: "#team",
              },
              {
                name: "Ubicaciones",
                icon: MapPin,
                color: "text-yellow-500",
                href: "#contacto",
              },
              {
                name: "Galería de Estilos",
                icon: Camera,
                color: "text-purple-500",
                href: "#galeria",
              },
              {
                name: "Sobre Nosotros",
                icon: Info,
                color: "text-cyan-500",
                href: "#nosotros",
              },
              {
                name: "Contacto",
                icon: Phone,
                color: "text-cyan-500",
                href: "#contacto",
              },
            ].map(({ name, icon: Icon, color, href }) => (
              <a
                key={name}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(href.substring(1));
                  if (element) {
                    // Cerrar el menú
                    setIsOpen(false);
                    // Hacer scroll suave después de un pequeño delay para que se cierre el menú
                    setTimeout(() => {
                      element.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 300);
                  }
                }}
                className="flex items-center gap-4 hover:text-red-500 transition-colors duration-300 border-b border-gray-800 pb-3 group"
              >
                <Icon
                  className={`w-6 h-6 ${color} group-hover:text-red-500 transition-colors duration-300`}
                />
                <span>{name}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* SECCIÓN HOME */}

      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          {/* Imagen de fondo */}
          <div className="w-full h-full relative">
            <img
              src="/stylish-man-sitting-barbershop.jpg"
              alt="Barber Shop main"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* difuminado en imagen main */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40"></div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 w-full px-4 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Contenido de texto */}
              <div className="space-y-6 lg:space-y-8">
                {/* Título principal */}
                <div className="space-y-4">
                  <div className="overflow-hidden">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tight animate-slide-up">
                      <span className="block mb-3 relative">
                        EXPERTOS EN
                        <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
                      </span>
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-500 mb-3 animate-gradient-x">
                        ESTILOS
                      </span>
                      <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-200 relative">
                        CLÁSICOS Y MODERNOS
                        <div className="absolute -bottom-2 right-0 w-24 h-1 bg-gradient-to-l from-red-500 to-transparent"></div>
                      </span>
                    </h1>
                  </div>
                </div>

                {/* Descripción */}
                <div className="max-w-2xl">
                  <p className="text-gray-200 text-xl sm:text-2xl leading-relaxed font-light relative">
                    Te damos la bienvenida a{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-400 font-bold">
                      Caballeros del Señor
                    </span>
                    , donde el estilo, la precisión y la elegancia se combinan
                    para brindarte lo mejor de ti.
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-white to-red-500 opacity-50"></div>
                  </p>
                </div>

                {/* Botón de acción */}
                <div className="pt-6">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-white to-red-500 text-black font-black py-6 px-16 text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl transform hover:rotate-1">
                    <span className="relative z-10 flex items-center gap-3">
                      <Calendar className="w-6 h-6" />
                      <Link to={'/reservar'}>RESERVAR AHORA</Link>
                    </span>
                    {/* <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div> */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Redes sociales - Desktop y tablet horizontal (1024px+) */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 hidden xl:flex flex-col gap-4">
          {[
            { href: "#", src: "/facebook.png", alt: "Facebook" },
            { href: "#", src: "/instagram.png", alt: "Instagram" },
            { href: "#", src: "/whatsapp.png", alt: "WhatsApp" },
            { href: "#", src: "/tik-tok.png", alt: "tik-tok" },
          ].map(({ href, src, alt }) => (
            <a key={alt} href={href} className="group">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                <img src={src} alt={alt} className="w-6 h-6" />
              </div>
            </a>
          ))}
        </div>

        {/* Redes sociales - Tablet vertical y laptop pequeño (768px - 1279px) */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 hidden md:flex xl:hidden">
          <div className="flex gap-4 bg-black/20 backdrop-blur-md rounded-full px-6 py-3">
            {[
              { href: "#", src: "/facebook.png", alt: "Facebook" },
              { href: "#", src: "/instagram.png", alt: "Instagram" },
              { href: "#", src: "/whatsapp.png", alt: "WhatsApp" },
              { href: "#", src: "/tik-tok.png", alt: "tik-tok" },
            ].map(({ href, src, alt }) => (
              <a key={alt} href={href} className="group">
                <div className="p-2.5 bg-white/30 backdrop-blur-sm rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                  <img src={src} alt={alt} className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Redes sociales - Móvil horizontal (480px - 767px) */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 hidden sm:flex md:hidden">
          <div className="flex gap-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
            {[
              { href: "#", src: "/facebook.png", alt: "Facebook" },
              { href: "#", src: "/instagram.png", alt: "Instagram" },
              { href: "#", src: "/whatsapp.png", alt: "WhatsApp" },
              { href: "#", src: "/tik-tok.png", alt: "tik-tok" },
            ].map(({ href, src, alt }) => (
              <a key={alt} href={href} className="group">
                <div className="p-2 bg-white/25 rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                  <img src={src} alt={alt} className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Redes sociales - Móvil vertical (menos de 480px) */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex sm:hidden">
          <div className="flex gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-2">
            {[
              { href: "#", src: "/facebook.png", alt: "Facebook" },
              { href: "#", src: "/instagram.png", alt: "Instagram" },
              { href: "#", src: "/whatsapp.png", alt: "WhatsApp" },
              { href: "#", src: "/tik-tok.png", alt: "tik-tok" },
            ].map(({ href, src, alt }) => (
              <a key={alt} href={href} className="group">
                <div className="p-1.5 bg-white/25 rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-105 transform">
                  <img src={src} alt={alt} className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}

      <section
        id="nosotros"
        className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white"
      >
        <div className="container mx-auto px-4 lg:px-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Contenido de texto */}
            <div className="order-2 lg:order-1 space-y-8">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
                  <span className="text-white">SOBRE</span>{" "}
                  <span className="text-red-500">NOSOTROS</span>
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mb-8"></div>
              </div>

              {/* Misión */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-blue-500 flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  NUESTRA MISIÓN
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  En Caballeros del Señor, nos dedicamos a brindar servicios de
                  barbería de la más alta calidad, combinando técnicas
                  tradicionales con tendencias modernas. Nuestro compromiso es
                  hacer que cada cliente se sienta único, elegante y seguro de
                  sí mismo, ofreciendo una experiencia personalizada que refleje
                  su estilo y personalidad.
                </p>
              </div>

              {/* Visión */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  NUESTRA VISIÓN
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Ser reconocidos como la barbería líder en excelencia y
                  innovación, donde el arte del cuidado masculino se eleva a su
                  máxima expresión. Aspiramos a ser el referente en estilo y
                  elegancia, creando un espacio donde tradición y modernidad se
                  encuentran para ofrecer la mejor experiencia de barbería en
                  cada visita.
                </p>
              </div>

              {/* Valores adicionales */}
              <div className="grid sm:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    10+
                  </div>
                  <div className="text-gray-400 text-sm">
                    Años de Experiencia
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    100%
                  </div>
                  <div className="text-gray-400 text-sm">
                    Servicios personalizados
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    2
                  </div>
                  <div className="text-gray-400 text-sm">Sedes Disponibles</div>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-red-500/20 to-yellow-400/20 rounded-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-black rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src="/barberhome.jpg"
                    alt="Interior de Caballeros del Señor"
                    className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                </div>
              </div>

              {/* Elemento decorativo luz */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-20 left-10 w-2 h-20 bg-gradient-to-b from-blue-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-2 h-20 bg-gradient-to-t from-red-500 to-transparent opacity-50"></div>
      </section>

      {/* SECCIÓN SERVICIOS */}

      <section
        id="servicios"
        className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-700 to-gray-900 text-white py-20"
      >
        <div className="container mx-auto px-4 lg:px-10">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="text-white">NUESTROS</span>{" "}
              <span className="text-blue-500">SERVICIOS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Ofrecemos servicios de barbería de alta calidad con técnicas
              tradicionales y modernas
            </p>
          </div>

          {/* Grid de servicios */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Servicio 1 - Corte Básico */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-20v18a4 4 0 004 4V5a2 2 0 00-2-2h-4z"
                  />
                </svg>
              </div>

              <div className="mb-6">
                <img src="/barberhome.jpg" alt="" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                Corte Básico
              </h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-blue-500">
                  $15.000
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
                <svg
                  className="w-4 h-4"
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
                <span className="text-sm">30 min</span>
              </div>

              <p className="text-gray-300 text-sm text-center mb-6">
                Corte de cabello profesional adaptado a tu estilo y preferencias
                personales.
              </p>

              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 group-hover:scale-105 transform shadow-lg hover:shadow-blue-500/25">
                Reservar
              </button>
            </div>

            {/* Servicio 2 - Corte + Barba */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-red-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>

              <div className="mb-6">
                <img src="/stylish-man-sitting-barbershop.jpg" alt="" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                Corte + Barba
              </h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-red-500">
                  $20.000
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
                <svg
                  className="w-4 h-4"
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
                <span className="text-sm">40 min</span>
              </div>

              <p className="text-gray-300 text-sm text-center mb-6">
                Servicio completo que incluye corte de cabello y definición
                perfecta del contorno de barba.
              </p>

              <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 group-hover:scale-105 transform shadow-lg hover:shadow-red-500/25">
                Reservar
              </button>
            </div>

            {/* Servicio 3 - Servicio Premium */}
            <div className="group relative bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 md:col-span-2 lg:col-span-1">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>

              <div className="mb-6">
                <img src="/barberhome.jpg" alt="" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                Servicio Premium
              </h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-yellow-500">
                  $35.000
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
                <svg
                  className="w-4 h-4"
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
                <span className="text-sm">70 min</span>
              </div>

              <p className="text-gray-300 text-sm text-center mb-6">
                Experiencia completa: corte, barba, tratamiento capilar, masaje
                relajante y cuidado facial.
              </p>

              <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 group-hover:scale-105 transform shadow-lg hover:shadow-yellow-500/25">
                Reservar
              </button>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-40 left-5 w-1 h-16 bg-gradient-to-b from-blue-500 to-transparent opacity-30"></div>
        <div className="absolute bottom-40 right-5 w-1 h-16 bg-gradient-to-t from-red-500 to-transparent opacity-30"></div>
      </section>

      {/* SECCIÓN NUESTRO EQUIPO */}

      <section
        id="team"
        className="relative min-h-screen bg-gradient-to-b from-gray-900 via-red-500 to-black text-white py-20"
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
              Profesionales expertos con años de experiencia listos para
              brindarte el mejor servicio
            </p>
          </div>

          {/* Grid del equipo */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Miembro 1 - Carlos Gómez */}
            <div className="group relative bg-gradient-to-br from-blue-600/80 via-white/10 to-red-500/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              {/* Contenedor de imagen */}
              <div className="relative h-100 overflow-hidden bg-gradient-to-b from-transparent to-black/30">
                {/* Aquí puedes agregar la imagen */}
                <img
                  src="/barbero1.jpg"
                  alt="carlos gomez"
                  className="w-full h-full object-cover"
                />
                {/* Badge de sede */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 via-white to-red-500 text-black  px-3 py-1 rounded-full text-sm font-bold z-20 shadow-lg">
                  Sede 1
                </div>
              </div>

              {/* Contenido de texto */}
              <div className="relative p-6 bg-gradient-to-br from-blue-600/60 via-white/20 to-red-500/60 backdrop-blur-md">
                <div className="absolute inset-0 bg-black/20 rounded-b-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    Carlos Gómez
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">
                    Especialista en cortes clásicos y modernos con más de 8 años
                    de experiencia.
                  </p>
                </div>
              </div>
            </div>

            {/* Miembro 2 - Sebastian Castillo */}
            <div className="group relative bg-gradient-to-br from-blue-600/80 via-white/10 to-red-500/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              {/* Contenedor de imagen */}
              <div className="relative h-100 overflow-hidden bg-gradient-to-b from-transparent to-black/30">
                <img
                  src="/barbero2.jpg"
                  alt="carlos gomez"
                  className="w-full h-full object-cover"
                />

                {/* Badge de sede */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 via-white to-red-500 text-black px-3 py-1 rounded-full text-sm font-bold z-20 shadow-lg">
                  Sede 2
                </div>
              </div>

              <div className="relative p-6 bg-gradient-to-br from-blue-600/60 via-white/20 to-red-500/60 backdrop-blur-md">
                <div className="absolute inset-0 bg-black/20 rounded-b-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    Sebastian Castillo
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">
                    Creativo en tendencias actuales y técnicas de coloración con
                    6 años de trayectoria.
                  </p>
                </div>
              </div>
            </div>

            {/* Miembro 3 - Brayan Pérez */}
            <div className="group relative bg-gradient-to-br from-blue-600/80 via-white/10 to-red-500/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              {/* Contenedor de imagen */}
              <div className="relative h-100 overflow-hidden bg-gradient-to-b from-transparent to-black/30">
                <img
                  src="/barbero3.jpg"
                  alt="carlos gomez"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 via-white to-red-500 text-black px-3 py-1 rounded-full text-sm font-bold z-20 shadow-lg">
                  Sede 2
                </div>
              </div>

              <div className="relative p-6 bg-gradient-to-br from-blue-600/60 via-white/20 to-red-500/60 backdrop-blur-md">
                <div className="absolute inset-0 bg-black/20 rounded-b-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    Brayan Pérez
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">
                    Innovador en estilos únicos y tratamientos capilares con
                    enfoque personalizado.
                  </p>
                </div>
              </div>
            </div>

            {/* Miembro 4 - Gregory López */}
            <div className="group relative bg-gradient-to-br from-blue-600/80 via-white/10 to-red-500/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              {/* Contenedor de imagen */}
              <div className="relative h-100 overflow-hidden bg-gradient-to-b from-transparent to-black/30">
                <img
                  src="/barbero4.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 via-white to-red-500 text-black px-3 py-1 rounded-full text-sm font-bold z-20 shadow-lg">
                  Sede 1
                </div>
              </div>

              <div className="relative p-6 bg-gradient-to-br from-blue-600/60 via-white/20 to-red-500/60 backdrop-blur-md">
                <div className="absolute inset-0 bg-black/20 rounded-b-2xl"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                    Gregory López
                  </h3>
                  <p className="text-white/90 text-sm leading-relaxed font-medium">
                    Maestro en técnicas tradicionales de barbería y arreglo de
                    barba con 10 años de experiencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos de fondo */}
        <div className="absolute top-32 left-8 w-1 h-12 bg-gradient-to-b from-red-500 to-transparent opacity-40"></div>
        <div className="absolute bottom-32 right-8 w-1 h-12 bg-gradient-to-t from-blue-500 to-transparent opacity-40"></div>
        <div className="absolute top-1/2 left-4 w-8 h-8 border border-white/10 rounded-full"></div>
        <div className="absolute top-1/3 right-4 w-6 h-6 border border-red-500/20 rounded-full"></div>
      </section>

      {/* SECCIÓN GALERÍA */}

      <section
        id="galeria"
        className="relative min-h-screen bg-gradient-to-b from-black via-white to-black text-white py-20"
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

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-2 h-20 bg-gradient-to-b from-yellow-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-2 h-20 bg-gradient-to-t from-blue-500 to-transparent opacity-50"></div>
      </section>

      {/* SECCIÓN CONTACTO */}

      <section
        id="contacto"
        className="relative min-h-screen bg-gradient-to-b from- to-blue-900 text-white py-20"
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
                        <p className="text-white font-semibold mb-1">
                          Dirección
                        </p>
                        <p className="text-gray-300">{sede.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">
                          Teléfono
                        </p>
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
                        <p className="text-white font-semibold mb-1">
                          Horarios
                        </p>
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

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-2 h-20 bg-gradient-to-b from-yellow-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-2 h-20 bg-gradient-to-t from-blue-500 to-transparent opacity-50"></div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-white to-red-600"></div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Información Principal */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-red-500 mb-4">
                Caballeros del Señor
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Comprometidos con la excelencia y el servicio desde 2010.
                Nuestra misión es brindar calidad y confianza en cada proyecto.
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
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-white">Sede Principal</p>
                    <p>Calle 123 #45-67, cali</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios */}
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
            </div>

            {/*  sedes y FAQ */}

            
            <div className="space-y-3">
              <Link
                to="/Faq"
                className="inline-flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Preguntas Frecuentes
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-6 ">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © 2025 Caballeros del Señor. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Barbershop;