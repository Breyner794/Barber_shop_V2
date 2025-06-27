import { Calendar} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SocialMedia from "../components/SocialMedia";
import Services from "../components/Services";
import Team from "../components/Team";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";

function Barbershop() {

  return (
    <div className="min-h-screen bg-black">
      <Header />
      {/* SECCIÓN HOME */}
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10 sm:pt-16 sm:pb-8 "
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
        <div className="relative z-10 w-full px-4 lg:px-10 py-8 sm:py-0">
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

                {/* Redes sociales - móvil */}
                <div className="block md:hidden">
                  <SocialMedia
                    position="home-mobile"
                    theme="transparent"
                    size="medium"
                  />
                </div>

                {/* Redes sociales - tablet */}
                <div className="hidden md:block lg:hidden">
                  <SocialMedia
                    position="home-tablet"
                    theme="transparent"
                    size="large"
                  />
                </div>

                {/* Botón de acción */}
                <div className="pt-6 mt-6">
                  <button className="group relative overflow-hidden bg-red-600 text-white font-extrabold py-5 px-14 text-xl rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-xl  focus:outline-none">
                    <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-color duration-500">
                      <Calendar className="w-6 h-6" />
                      <Link to={'/reservar'}>RESERVAR AHORA</Link>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-white to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
                    {/* Efecto de brillo deslizante */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </button>
                </div>

                {/* Redes sociales - desktop */}
                <div className="hidden md:block">
                  <SocialMedia position="home" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section
        id="nosotros"
        className="relative min-h-screen bg-gradient-to-t from-black to-gray-900 text-white"
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
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
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
      </section>

      {/* SECCIÓN SERVICIOS */}
      <Services />

      {/* SECCIÓN NUESTRO EQUIPO */}
      <Team />

      {/* SECCIÓN GALERÍA */}
      <Gallery />

      {/* SECCIÓN CONTACTO */}
      <Contact />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Barbershop;