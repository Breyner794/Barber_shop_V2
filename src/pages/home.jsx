import { useState } from "react";
import { Menu, X, MapPin, Phone, Mail, Clock,Calendar, Scissors, Users, Camera, Info,  Facebook, Instagram } from "lucide-react";

function Barbershop() {
  const [isOpen, setIsOpen] = useState(false);
 // Datos de las sedes
  const sedes = [
    {
      name: "Sede Kyiv",
      address: "Yaroslavska 8, Kyiv",
      phone: "+380995002233",
      email: "info@corterbaber.ua",
      hours: "10:00-20:00",
      mapUrl: "https://maps.google.com/?q=Yaroslavska+8,+Kyiv,+Ukraine",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.1234!2d30.5234!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzAwLjQiTiAzMMKwMzEnMjQuMyJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
      gradientFrom: "from-blue-600",
      gradientTo: "to-blue-800",
      hoverShadow: "hover:shadow-blue-500/25"
    },
    {
      name: "Sede Cali",
      address: "Calle 118 #24-43, Compartir, Cali",
      phone: "+57 301 234 5678",
      email: "cali@corterbaber.co",
      hours: "09:00-19:00",
      mapUrl: "https://maps.google.com/?q=Calle+118+24-43,+Compartir,+Cali,+Colombia",
      embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.1234!2d-76.5321!3d3.4516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjcnMDUuOCJOIDc2wrAzMSc1NS42Ilc!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s",
      gradientFrom: "from-red-600",
      gradientTo: "to-red-800",
      hoverShadow: "hover:shadow-red-500/25"
    }
  ];

  const handleMapClick = (mapUrl) => {
    window.open(mapUrl, '_blank');
  };

  const handleBookVisit = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="relative z-30 px-4 lg:px-10 py-6 bg-black backdrop-blur-sm">
        <nav className="hidden lg:flex items-center justify-center w-full">
          {/* Logo centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-40 h-20 bg-gradient-to-r from-blue-600 via-white to-red-500 rounded-lg flex items-center justify-center text-black font-bold text-xl drop-shadow-lg">
              <img src="/public/logo-tipo-barber.svg" alt="" />
            </div>
          </div>

          {/* Menú distribuido */}
          <div className="flex w-full justify-between items-center max-w-6xl mx-auto">
            <div className="flex gap-8 font-medium">
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-300 tracking-wide text-sm uppercase">HOME</a>
              <a href="#" className="text-white hover:text-red-500 transition-colors duration-300 tracking-wide text-sm uppercase">RESERVAS</a>
              <a href="#" className="text-white hover:text-blue-500 transition-colors duration-300 tracking-wide text-sm uppercase">SERVICIOS</a>
            </div>
            
            <div className="w-20"></div> {/* Espaciador para el logo */}
            
            <div className="flex gap-8 font-medium">
              <a href="#" className="text-white hover:text-red-500 transition-colors duration-300 tracking-wide text-sm uppercase">SEDES</a>
              <a href="#" className="text-white hover:text-blue-500 transition-colors duration-300 tracking-wide text-sm uppercase">GALERÍA</a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-300 tracking-wide text-sm uppercase">NOSOTROS</a>
            </div>
          </div>
        </nav>

        {/* Header móvil */}
        <div className="lg:hidden flex justify-between items-center">
          <div className="w-24 h-12 bg-gradient-to-r from-blue-600 via-white to-red-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
            <img src="/public/logo-tipo-barber.svg" alt="" />
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
        <div className="fixed top-0 left-0 w-full h-full bg-black/95 text-white z-40 p-10 transition-all duration-300">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <nav className="mt-20 space-y-6 text-xl font-semibold">
            {[
              { name: "Reservas", icon: Calendar, color: "text-blue-500" },
              { name: "Servicios", icon: Scissors, color: "text-red-500" },
              { name: "Barberos", icon: Users, color: "text-green-500" },
              { name: "Sedes", icon: MapPin, color: "text-yellow-500" },
              { name: "Galería", icon: Camera, color: "text-purple-500" },
              { name: "Nosotros", icon: Info, color: "text-cyan-500" }
            ].map(({ name, icon: Icon, color }) => (
              <a key={name} href="#" className="flex items-center gap-4 hover:text-red-500 transition-colors duration-300 border-b border-gray-800 pb-3 group">
                <Icon className={`w-6 h-6 ${color} group-hover:text-red-500 transition-colors duration-300`} />
                <span>{name}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Sección HOME */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           {/* Imagen de fondo */}
          <div className="w-full h-full relative">
            <img 
              src="/public/stylish-man-sitting-barbershop.jpg" 
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
                {/* Título principal más llamativo */}
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

                {/* Descripción mejorada */}
                <div className="max-w-2xl">
                  <p className="text-gray-200 text-xl sm:text-2xl leading-relaxed font-light relative">
                    Te damos la bienvenida a{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-red-400 font-bold">
                      Caballeros del Señor
                    </span>
                    , donde el estilo, la precisión y la elegancia se combinan para brindarte lo mejor de ti.
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-white to-red-500 opacity-50"></div>
                  </p>
                </div>

                {/* Botón de acción más llamativo */}
                <div className="pt-6">
                  <button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-white to-red-500 text-black font-black py-6 px-16 text-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl transform hover:rotate-1">
                    <span className="relative z-10 flex items-center gap-3">
                      <Calendar className="w-6 h-6" />
                      RESERVAR AHORA
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Redes sociales - Posición fija lateral */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col gap-4">
          {[
            { href: "#", src: "/public/square-facebook-brands-solid.svg", alt: "Facebook" },
            { href: "#", src: "/public/square-instagram-brands-solid.svg", alt: "Instagram" },
            { href: "#", src: "/public/square-whatsapp-brands-solid.svg", alt: "WhatsApp" },
          ].map(({ href, src, alt }) => (
            <a key={alt} href={href} className="group">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                <img src={src} alt={alt} className="w-6 h-6 filter invert group-hover:invert-0" />
              </div>
            </a>
          ))}
        </div>

        {/* Redes sociales móvil */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 lg:hidden">
          <div className="flex gap-4 bg-black/0 backdrop-blur-md rounded-full px-6 py-3">
            {[
              { href: "#", src: "/public/square-facebook-brands-solid.svg", alt: "Facebook" },
              { href: "#", src: "/public/square-instagram-brands-solid.svg", alt: "Instagram" },
              { href: "#", src: "/public/square-whatsapp-brands-solid.svg", alt: "WhatsApp" },
            ].map(({ href, src, alt }) => (
              <a key={alt} href={href} className="group">
                <div className="p-3 bg-white/20 rounded-full transition duration-300 group-hover:bg-red-500 group-hover:scale-110 transform">
                  <img src={src} alt={alt} className="w-5 h-5 filter invert group-hover:invert-0" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>



     {/* Sección Sobre Nosotros */}
      <section className="relative min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
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
                  En Caballeros del Señor, nos dedicamos a brindar servicios de barbería de la más alta calidad, 
                  combinando técnicas tradicionales con tendencias modernas. Nuestro compromiso es hacer que cada 
                  cliente se sienta único, elegante y seguro de sí mismo, ofreciendo una experiencia personalizada 
                  que refleje su estilo y personalidad.
                </p>
              </div>

              {/* Visión */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-red-500 flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  NUESTRA VISIÓN
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Ser reconocidos como la barbería líder en excelencia y innovación, donde el arte del cuidado 
                  masculino se eleva a su máxima expresión. Aspiramos a ser el referente en estilo y elegancia, 
                  creando un espacio donde tradición y modernidad se encuentran para ofrecer la mejor experiencia 
                  de barbería en cada visita.
                </p>
              </div>

              {/* Valores adicionales */}
              <div className="grid sm:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-blue-500 mb-2">15+</div>
                  <div className="text-gray-400 text-sm">Años de Experiencia</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-red-500 mb-2">100%</div>
                  <div className="text-gray-400 text-sm">Clientes Satisfechos</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">2</div>
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
                    src="/public/barberhome.jpg"
                    alt="Interior de Caballeros del Señor"
                    className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
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


      {/* Sección Servicios */}
      <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-700 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 lg:px-10">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="text-white">NUESTROS</span>{" "}
              <span className="text-blue-500">SERVICIOS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Ofrecemos servicios de barbería de alta calidad con técnicas tradicionales y modernas
            </p>
          </div>

          {/* Grid de servicios */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Servicio 1 - Corte Básico */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 18v2m8-20v18a4 4 0 004 4V5a2 2 0 00-2-2h-4z" />
                </svg>
              </div>
              
              <div className="mb-6">
                <img src="/public/barberhome.jpg" alt="" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Corte Básico</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-blue-500">$15.000</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">30 min</span>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-6">
                Corte de cabello profesional adaptado a tu estilo y preferencias personales.
              </p>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 group-hover:scale-105 transform shadow-lg hover:shadow-blue-500/25">
                Reservar
              </button>
            </div>

            {/* Servicio 2 - Corte + Barba */}
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/30 hover:border-red-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              
              <div className="mb-6">
                <img src="/public/stylish-man-sitting-barbershop.jpg" alt="" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Corte + Barba</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-red-500">$20.000</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">40 min</span>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-6">
                Servicio completo que incluye corte de cabello y definición perfecta del contorno de barba.
              </p>
              
              <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 group-hover:scale-105 transform shadow-lg hover:shadow-red-500/25">
                Reservar
              </button>
            </div>

            {/* Servicio 3 - Servicio Premium */}
            <div className="group relative bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 md:col-span-2 lg:col-span-1">
              <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              
              <div className="mb-6">
                <img src="/public/barberhome.jpg" alt="" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 text-center">Servicio Premium</h3>
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-yellow-500">$35.000</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">70 min</span>
              </div>
              
              <p className="text-gray-300 text-sm text-center mb-6">
                Experiencia completa: corte, barba, tratamiento capilar, masaje relajante y cuidado facial.
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
      

        {/* Sección Nuestro Equipo */}
      <section className="relative min-h-screen bg-gradient-to-b from-gray-900 via-red-500 to-black text-white py-20">
        <div className="container mx-auto px-4 lg:px-10">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="text-white">NUESTRO</span>{" "}
              <span className="text-red-500">EQUIPO</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Profesionales expertos con años de experiencia listos para brindarte el mejor servicio
            </p>
          </div>

          {/* Grid del equipo */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            
            {/* Miembro 1 - Carlos Gómez */}
            <div className="group relative bg-gradient-to-br from-blue-900/30 to-blue-800/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">CG</span>
                    </div>
                    <div className="text-white font-semibold">Barbero</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-20">
                  Sede 1
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Carlos Gómez</h3>
                <p className="text-blue-400 font-semibold mb-3">Barbero Senior</p>
                <p className="text-gray-400 text-sm mb-4">
                  Especialista en cortes clásicos y modernos con más de 8 años de experiencia.
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Cortes Clásicos</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Fade</span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                  Reservar con Carlos
                </button>
              </div>
            </div>

            {/* Miembro 2 - Sebastian Castillo */}
            <div className="group relative bg-gradient-to-br from-green-900/30 to-green-800/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-green-500/20 hover:border-green-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">SC</span>
                    </div>
                    <div className="text-white font-semibold">Peluquero</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-20">
                  Sede 2
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Sebastian Castillo</h3>
                <p className="text-green-400 font-semibold mb-3">Peluquero Experto</p>
                <p className="text-gray-400 text-sm mb-4">
                  Creativo en tendencias actuales y técnicas de coloración con 6 años de trayectoria.
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Tendencias</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Color</span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                  Reservar con Sebastian
                </button>
              </div>
            </div>

            {/* Miembro 3 - Brayan Pérez */}
            <div className="group relative bg-gradient-to-br from-purple-900/30 to-purple-800/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">BP</span>
                    </div>
                    <div className="text-white font-semibold">Peluquero</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-20">
                  Sede 2
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Brayan Pérez</h3>
                <p className="text-purple-400 font-semibold mb-3">Peluquero Creativo</p>
                <p className="text-gray-400 text-sm mb-4">
                  Innovador en estilos únicos y tratamientos capilares con enfoque personalizado.
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Estilos Únicos</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Tratamientos</span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                  Reservar con Brayan
                </button>
              </div>
            </div>

            {/* Miembro 4 - Gregory López */}
            <div className="group relative bg-gradient-to-br from-orange-900/30 to-orange-800/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-orange-500/20 hover:border-orange-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <div className="w-full h-full bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">GL</span>
                    </div>
                    <div className="text-white font-semibold">Barbero</div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-20">
                  Sede 1
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Gregory López</h3>
                <p className="text-orange-400 font-semibold mb-3">Barbero Master</p>
                <p className="text-gray-400 text-sm mb-4">
                  Maestro en técnicas tradicionales de barbería y arreglo de barba con 10 años de experiencia.
                </p>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">Barbería Clásica</span>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">Barba</span>
                </div>
                
                <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                  Reservar con Gregory
                </button>
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

            {/* Sección Galería */}
      <section className="relative min-h-screen bg-gradient-to-b from-black via-white to-black text-white py-20">
        <div className="container mx-auto px-4 lg:px-10">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="text-white">NUESTROS</span>{" "}
              <span className="text-yellow-500">TRABAJOS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Descubre nuestros mejores trabajos y encuentra la inspiración para tu próximo estilo
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="filter-btn active px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
              Todos
            </button>
            <button className="filter-btn px-6 py-3 bg-gray-800 hover:bg-red-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
              Cortes Clásicos
            </button>
            <button className="filter-btn px-6 py-3 bg-gray-800 hover:bg-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
              Cortes Modernos
            </button>
            <button className="filter-btn px-6 py-3 bg-gray-800 hover:bg-green-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
              Barbas
            </button>
            <button className="filter-btn px-6 py-3 bg-gray-800 hover:bg-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg">
              Fade
            </button>
          </div>

          {/* Grid de fotos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            
            {/* Foto 1 */}
            <div className="gallery-item corte-clasico group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Corte Clásico</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Estilo Clásico Elegante</h3>
                  <p className="text-gray-300 text-sm">Por Carlos Gómez</p>
                </div>
              </div>
            </div>

            {/* Foto 2 */}
            <div className="gallery-item corte-moderno group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Corte Moderno</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Estilo Urbano</h3>
                  <p className="text-gray-300 text-sm">Por Sebastian Castillo</p>
                </div>
              </div>
            </div>

            {/* Foto 3 */}
            <div className="gallery-item barba group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-green-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Arreglo de Barba</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Barba Perfecta</h3>
                  <p className="text-gray-300 text-sm">Por Gregory López</p>
                </div>
              </div>
            </div>

            {/* Foto 4 */}
            <div className="gallery-item fade group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Fade Degradado</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Fade Profesional</h3>
                  <p className="text-gray-300 text-sm">Por Brayan Pérez</p>
                </div>
              </div>
            </div>

            {/* Foto 5 */}
            <div className="gallery-item corte-clasico group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Estilo Premium</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Corte Ejecutivo</h3>
                  <p className="text-gray-300 text-sm">Por Carlos Gómez</p>
                </div>
              </div>
            </div>

            {/* Foto 6 */}
            <div className="gallery-item fade group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Fade Alto</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">High Fade</h3>
                  <p className="text-gray-300 text-sm">Por Gregory López</p>
                </div>
              </div>
            </div>

            {/* Foto 7 */}
            <div className="gallery-item corte-moderno group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Estilo Trendy</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Corte Moderno</h3>
                  <p className="text-gray-300 text-sm">Por Sebastian Castillo</p>
                </div>
              </div>
            </div>

            {/* Foto 8 */}
            <div className="gallery-item barba group relative bg-gradient-to-br from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/25 transition-all duration-500 hover:scale-105">
              <div className="aspect-square bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-white font-semibold">Barba Estilizada</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold mb-1">Barba de Caballero</h3>
                  <p className="text-gray-300 text-sm">Por Brayan Pérez</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-block bg-gradient-to-r from-yellow-600/20 via-red-500/20 to-blue-600/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4">¿Te gustó algún estilo?</h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Reserva tu cita y deja que nuestros expertos recreen el estilo perfecto para ti
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


            {/* Sección Contacto */}
      <section className="relative min-h-screen bg-gradient-to-b from- to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 lg:px-10">
          {/* Header de la sección */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="text-white">NUESTRO</span>{" "}
              <span className="text-blue-500">CONTACTO</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 via-white to-red-500 mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Visítanos en cualquiera de nuestras dos sedes. Estamos aquí para brindarte el mejor servicio de barbería.
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
                <div className={`bg-gradient-to-br ${sede.gradientFrom} ${sede.gradientTo} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{sede.name}</h3>
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
                        <Mail className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-white font-semibold mb-1">Email</p>
                        <a 
                          href={`mailto:${sede.email}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                          {sede.email}
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

                  {/* Botón de reserva */}
                  <button
                    onClick={() => handleBookVisit(sede.phone)}
                    className={`w-full bg-gradient-to-r ${sede.gradientFrom} ${sede.gradientTo} hover:scale-105 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3`}
                  >
                    <Phone className="w-5 h-5" />
                    <span>Reservar Cita</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-2 h-20 bg-gradient-to-b from-yellow-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-2 h-20 bg-gradient-to-t from-blue-500 to-transparent opacity-50"></div>
      </section>



        {/* Footer */}
 <footer className="bg-black text-white">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-white to-red-600"></div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Contacto */}
          <div>
            <h3 className="text-xl font-bold text-red-500 mb-3">Caballeros del Señor</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-red-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-red-500" />
                <span>info@caballerosdelsenor.com</span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Horarios</h4>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Lun - Vie: 9:00 - 20:00</span>
              </div>
              <p className="ml-6">Sáb: 8:00 - 18:00</p>
              <p className="ml-6">Dom: 10:00 - 16:00</p>
            </div>
          </div>

          {/* Redes y FAQ */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-3">Síguenos</h4>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
  
            </div>
            <a
              href="/preguntas-frecuentes"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
            >
              FAQ
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-sm">© 2025 Caballeros del Señor. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>  
  );
}

export default Barbershop;



