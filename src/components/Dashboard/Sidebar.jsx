import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BarChart3, Calendar, Scissors, MapPin, Users, Clock, X, UserIcon, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ProfileModal from './ProfileModal';

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
  
  const {logout, currentUser, setCurrentUser} = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const activeLinkClasses = "bg-blue-600/80 border-l-4 border-blue-400 text-white font-semibold";
  const defaultLinkClasses = "border-l-4 border-transparent text-gray-400 hover:bg-gray-700/50 hover:text-white";

  const handleLogout = () => {
    logout();
    if(window.innerWidth < 1024){
      setSidebarOpen(false);
    }
    navigate('/login')
  };

  const handleOpenProfileModal = () =>{
    setIsProfileModalOpen(true);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false); // Cierra el sidebar en móviles al abrir el modal
    }
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`
          bg-slate-900 border-r border-gray-800 text-white w-64 min-h-screen p-4
          fixed top-0 left-0 z-40
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col // Añadimos flexbox para el diseño de la parte inferior
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scissors className="w-8 h-8 text-blue-400" />
            BarberPro
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2 flex-grow"> {/* Añadimos flex-grow para que la navegación ocupe espacio */}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${isActive ? activeLinkClasses : defaultLinkClasses}`
              }
              onClick={() => { if(window.innerWidth < 1024) { setSidebarOpen(false) } }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* --- Sección del Perfil y Logout en la parte inferior --- */}
        <div className="mt-auto pt-4 border-t border-gray-700 space-y-2"> {/* mt-auto empuja hacia abajo */}
          {/* Item de Perfil que abre el modal */}
          {currentUser && (
            <button
              onClick={handleOpenProfileModal}
              className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 ${defaultLinkClasses}`}
            >
              {currentUser.imageUrl ? (
                <img src={currentUser.imageUrl} alt="Perfil" className="w-8 h-8 rounded-full object-cover border-2 border-blue-400" />
              ) : (
                <UserIcon className="w-8 h-8 text-gray-400 p-1 bg-gray-700 rounded-full" />
              )}
              <span className="font-semibold">{currentUser.name}</span>
              <Settings className="w-5 h-5 ml-auto text-gray-500" /> {/* Icono de ajustes */}
            </button>
          )}

          {/* Botón de Cerrar Sesión - Con estilos más prominentes */}
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors duration-200
                       bg-red-700 hover:bg-red-800 text-white font-bold border-l-4 border-red-500" // Estilos destacados
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* El Pop-up/Modal del perfil */}
      {isProfileModalOpen && currentUser && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={handleCloseProfileModal}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser} // Pasa el setter del contexto
        />
      )}
    </>
  );
};

export default Sidebar;