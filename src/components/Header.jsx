import React, { useState } from "react";
import { Link } from "react-router-dom";
import {Menu,X,Scissors,Calendar,Users,MapPin,Camera,Info,Phone,} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para manejar la navegación universal
  const handleNavigation = (sectionId, closeMenu = false) => {
    if (closeMenu) {
      setIsOpen(false);
      // Delay para permitir que se cierre el menú móvil
      setTimeout(() => {
        navigateToSection(sectionId);
      }, 300);
    } else {
      navigateToSection(sectionId);
    }
  };

  const navigateToSection = (sectionId) => {
    // Si es la sección "home", navegar a la página principal
    if (sectionId === "home") {
      // Si ya estamos en home, scroll al top
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/home"
      ) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Si estamos en otra página, redirigir a home
        window.location.href = "/";
      }
      return;
    }

    // Verificar si estamos en la página principal
    const isHomePage =
      window.location.pathname === "/" || window.location.pathname === "/home";

    if (isHomePage) {
      // Si estamos en home, hacer scroll a la sección
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Si estamos en otra página, redirigir a home con el anchor
      window.location.href = `/#${sectionId}`;
    }
  };

  // Menú items para navegación móvil
  const mobileMenuItems = [
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
      href: "servicios",
    },
    {
      name: "Nuestro Team",
      icon: Users,
      color: "text-green-500",
      href: "team",
    },
    {
      name: "Ubicaciones",
      icon: MapPin,
      color: "text-yellow-500",
      href: "contacto",
    },
    {
      name: "Galería de Estilos",
      icon: Camera,
      color: "text-purple-500",
      href: "galeria",
    },
    {
      name: "Contacto",
      icon: Phone,
      color: "text-cyan-500",
      href: "contacto",
    },
    {
      name: "Sobre Nosotros",
      icon: Info,
      color: "text-cyan-500",
      href: "nosotros",
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="relative z-30 px-4 lg:px-10 py-6 bg-black backdrop-blur-sm">
        <nav className="hidden lg:flex items-center justify-center w-full">
          {/* Logo centrado */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="w-40 h-20 bg-gradient-to-r from-blue-600 via-white to-red-500 rounded-lg flex items-center justify-center text-black font-bold text-xl drop-shadow-lg">
              <img src="/logo-tipo-barber.svg" alt="Logo Barbería" />
            </div>
          </div>

          {/* Menú distribuido */}
          <div className="flex w-full justify-between items-center max-w-6xl mx-auto">
            <div className="flex gap-8 font-medium">
              <button
                onClick={() => handleNavigation("home")}
                className="text-white hover:text-blue-400 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                HOME
              </button>
              <button
                className="text-white hover:text-red-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                 <Link to={'/reservar'}>RESERVAR</Link>
              </button>
              <button
                onClick={() => handleNavigation("servicios")}
                className="text-white hover:text-blue-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                SERVICIOS
              </button>
            </div>
            <div className="w-20"></div> {/* Espaciador para el logo */}
            <div className="flex gap-8 font-medium">
              <button
                onClick={() => handleNavigation("contacto")}
                className="text-white hover:text-red-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                SEDES
              </button>
              <button
                onClick={() => handleNavigation("galeria")}
                className="text-white hover:text-blue-500 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                GALERÍA
              </button>
              <button
                onClick={() => handleNavigation("nosotros")}
                className="text-white hover:text-blue-400 transition-colors duration-300 tracking-wide text-sm uppercase"
              >
                NOSOTROS
              </button>
            </div>
          </div>
        </nav>

        {/* HEADER MÓVIL */}
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
            {mobileMenuItems.map(({ name, icon: Icon, color, href }) => (
              <button
                key={name}
                onClick={() => handleNavigation(href, true)}
                className="flex items-center gap-4 hover:text-red-500 transition-colors duration-300 border-b border-gray-800 pb-3 group w-full text-left"
              >
                <Icon
                  className={`w-6 h-6 ${color} group-hover:text-red-500 transition-colors duration-300`}
                />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
