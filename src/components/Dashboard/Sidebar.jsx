import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Calendar, Scissors, MapPin, Users, Clock, X } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/dashboard/services', icon: Scissors, label: 'Services' },
  { to: '/dashboard/sites', icon: MapPin, label: 'Sites' },
  { to: '/dashboard/users', icon: Users, label: 'Users' },
  { to: '/dashboard/availability', icon: Clock, label: 'Availability' },
];

// El componente ahora recibe props para saber si debe mostrarse o no
const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  
  // Estilo para el enlace activo, ahora con un gradiente sutil
  const activeLinkClasses = "bg-blue-600/80 border-l-4 border-blue-400 text-white font-semibold";
  const defaultLinkClasses = "border-l-4 border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-white";

  return (
    <>
      {/* Overlay oscuro que aparece en móviles cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- El Sidebar en sí --- */}
      <div 
        className={`
          bg-slate-900 border-r border-gray-800 text-white w-64 min-h-screen p-4
          fixed top-0 left-0 z-40  /* Posicionamiento para el efecto de deslizamiento */
          transition-transform duration-300 ease-in-out  /* Animación suave */
          lg:static lg:translate-x-0  /* En pantallas grandes, se queda fijo y visible */
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} /* En móviles, se desliza según el estado */
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scissors className="w-8 h-8 text-blue-400" />
            BarberPro
          </h1>
          {/* Botón para cerrar el menú en móviles */}
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              // Ahora usamos clases para el estilo activo, es más limpio
              className={({ isActive }) => 
                `w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${isActive ? activeLinkClasses : defaultLinkClasses}`
              }
              // Al hacer clic en un enlace en móvil, cerramos el menú
              onClick={() => { if(window.innerWidth < 1024) { setSidebarOpen(false) } }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;