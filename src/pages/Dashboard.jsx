import React,{useState}from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react'; 
import Sidebar from '../components/Dashboard/Sidebar';
import DashboardOverview from '../components/Dashboard/DashboardOverview';
import BookingsModule from '../components/Dashboard/BookingsModule';
import ServicesModule from '../components/Dashboard/ServicesModule';
import SiteModule from '../components/Dashboard/SiteModule';
import UsersModule from '../components/Dashboard/UsersModule';
import AvailabilityModule from './Dashoard/AvailabilityModule';

const DashboardLayout = () => {
  // Estado para controlar la visibilidad del sidebar en móviles
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Contenedor principal ahora con el fondo oscuro correcto
    <div className="min-h-screen bg-gray-900 text-white lg:flex">
      
      {/* El Sidebar ahora recibe props para ser controlado */}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex-1 flex flex-col">
        {/* --- Cabecera para Móviles con el Botón de Hamburguesa --- */}
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-lg z-30 flex items-center justify-between p-4 border-b border-gray-800 lg:hidden">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Scissors className="w-6 h-6" />
            BarberPro
          </h1>
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* --- Contenido Principal --- */}
        {/* Outlet renderizará el módulo activo (Bookings, Services, etc.) */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="bookings" element={<BookingsModule />} />
        <Route path="services" element={<ServicesModule />} />
        <Route path="sites" element={<SiteModule />} />
        <Route path="users" element={<UsersModule />} />
        <Route path="availability" element={<AvailabilityModule />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;