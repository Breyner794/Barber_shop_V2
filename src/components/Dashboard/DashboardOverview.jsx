import React from 'react';
import { Calendar, Scissors, MapPin, Users, BarChart3, ArrowRight } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { NavLink } from 'react-router-dom';
import { mockData } from '../../data/mockData.js';

// Pequeña función auxiliar para el saludo
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días ☀️";
  if (hour < 18) return "Buenas tardes 🌇";
  return "Buenas noches 🌙";
};

const DashboardOverview = () => {
  const { appointments, services, sites, users } = mockData;

  // Datos para las tarjetas de estadísticas, para no repetir JSX
  const stats = [
    { 
      title: "Reservas de hoy", 
      value: appointments.filter(apt => isToday(parseISO(apt.date))).length,
      icon: Calendar,
      color: "blue"
    },
    { 
      title: "Barberos Activos", 
      value: users.filter(u => u.role === 'barber' && u.isActive).length,
      icon: Users,
      color: "orange"
    },
    { 
      title: "Servicios activos", 
      value: services.filter(s => s.isActive).length,
      icon: Scissors,
      color: "green"
    },
    { 
      title: "Sedes activas", 
      value: sites.filter(s => s.isActive).length,
      icon: MapPin,
      color: "purple"
    },
  ];

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="bg-gradient-to-tr from-black to-blue-700/30  min-h-full p-4 sm:p-6 space-y-8">
      
      {/* --- CABECERA DE BIENVENIDA --- */}
      <div>
        <h2 className="text-3xl md:text-4xl font-black text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400  to-purple-500">
            {getGreeting()} Admin!
          </span>
        </h2>
        <p className="text-gray-400 mt-2">Aquí tienes un resumén diario de tu negocio.</p>
      </div>

      {/* --- TARJETAS DE ESTADÍSTICAS (KPIs) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const colorClasses = {
            blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'hover:border-blue-500/50' },
            orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'hover:border-orange-500/50' },
            green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'hover:border-green-500/50' },
            purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/50' },
          };
          const currentColors = colorClasses[stat.color];

          return (
            <div key={stat.title} className={`bg-gray-800/50  rounded-2xl p-6 flex items-center gap-6 transition-colors duration-300 ${currentColors.border}`}>
              <div className={`p-4 rounded-lg ${currentColors.bg}`}>
                <stat.icon className={`w-8 h-8 ${currentColors.text}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-4xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- SECCIÓN INFERIOR (PRÓXIMAS CITAS Y GRÁFICO) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna de Próximas Citas */}
        <div className="lg:col-span-2 bg-gray-800/50 border-2 border-gray-700 rounded-2xl">
          <div className="p-5 flex justify-between items-center border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Proximas reservas</h3>
            <NavLink to="/dashboard/bookings" className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Ver todo <ArrowRight className="w-4 h-4" />
            </NavLink>
          </div>
          <div className="p-3 space-y-2">
            {upcomingAppointments.length > 0 ? upcomingAppointments.map(appointment => {
              const date = parseISO(appointment.date);
              let dayLabel;
              if (isToday(date)) {
                dayLabel = 'Today';
              } else if (isTomorrow(date)) {
                dayLabel = 'Tomorrow';
              } else {
                dayLabel = format(date, 'EEEE, MMM d', { locale: enUS });
              }

              return (
                <div key={appointment.id} className="p-4 rounded-lg flex items-center justify-between transition-colors hover:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="text-center w-12 flex-shrink-0">
                      <p className="text-xs text-gray-400">{format(date, 'MMM', { locale: enUS })}</p>
                      <p className="text-2xl font-bold text-white">{format(date, 'd')}</p>
                    </div>
                     <div className="w-px h-10 bg-gray-700"></div>
                    <div>
                      <p className="font-semibold text-white">{appointment.clientName}</p>
                      <p className="text-sm text-gray-400">{appointment.serviceName} with {appointment.barberName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{appointment.startTime}</p>
                    <p className="text-xs text-gray-400">{dayLabel}</p>
                  </div>
                </div>
              );
            }) : <p className="text-center py-8 text-gray-500">No hay proximas reservas.</p>}
          </div>
        </div>

        {/* Columna de Gráfico (Placeholder) */}
        <div className="bg-gray-800/50 border-2 border-gray-700 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-lg bg-gray-700/50 mb-4">
                <BarChart3 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Analíticas</h3>
            <p className="text-gray-400 mt-2 max-w-xs">
                A chart with weekly booking trends will be displayed here soon.
            </p>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;