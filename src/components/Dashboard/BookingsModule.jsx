import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye,
  CheckCircle, XCircle, AlertCircle, User, Scissors, Calendar, Info
} from 'lucide-react';
import { mockData } from '../../data/mockData.js';

// --- NUEVAS FUNCIONES DE ESTILO ---
// Actualizamos los colores para que coincidan con el tema oscuro
const getStatusStyles = (status) => {
  const styles = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
    'no-show': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  };
  return styles[status] || styles['no-show'];
};

const getStatusIcon = (status) => {
  switch(status) {
    case 'confirmed':
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'canceled':
      return <XCircle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const BookingsModule = () => {
  const { appointments } = mockData;
  const [searchTerm, setSearchTerm] = useState('');

  // Lógica de filtrado (puedes expandirla más adelante)
  const filteredAppointments = appointments.filter(appointment =>
    appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.barberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Contenedor principal con el fondo oscuro y padding responsivo
    <div className="bg-gray-900 min-h-full p-4 sm:p-6">
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Manage Bookings
          </span>
        </h2>
        <button 
          className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform 
                     bg-gradient-to-r from-blue-500 to-blue-600 text-white
                     hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      {/* --- BARRA DE BÚSQUEDA Y FILTROS --- */}
      <div className="mb-8 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client, barber, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* --- LISTA DE TARJETAS DE RESERVA (RESPONSIVO) --- */}
      {/* Esto reemplaza la tabla. Es un grid que se adapta a la pantalla */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.map(appointment => (
          <div key={appointment.id} className="bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:scale-[1.02]">
            
            {/* --- Cabecera de la Tarjeta --- */}
            <div className="p-5 flex justify-between items-start border-b border-gray-700">
              <div>
                <p className="font-bold text-lg text-white">{appointment.clientName}</p>
                <p className="text-sm text-gray-400">{appointment.clientPhone}</p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusStyles(appointment.status)}`}>
                {getStatusIcon(appointment.status)}
                {appointment.status}
              </span>
            </div>
            
            {/* --- Cuerpo de la Tarjeta (Detalles) --- */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Scissors className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Service</p>
                  <p className="font-medium text-white">{appointment.serviceName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Barber</p>
                  <p className="font-medium text-white">{appointment.barberName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Date & Time</p>
                  <p className="font-medium text-white">
                    {format(parseISO(appointment.date), 'EEEE, MMMM d, yyyy', { locale: enUS })}
                    <span className="text-gray-400"> at </span>
                    {appointment.startTime}
                  </p>
                </div>
              </div>
               <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Notes</p>
                  <p className="font-medium text-white italic">"{appointment.notes}"</p>
                </div>
              </div>
            </div>

            {/* --- Pie de la Tarjeta (Acciones) --- */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex justify-end gap-2">
              <button className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"><Eye className="w-5 h-5" /></button>
              <button className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"><Edit className="w-5 h-5" /></button>
              <button className="p-2 rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mensaje por si no hay resultados */}
      {filteredAppointments.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold text-gray-300">No bookings found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

    </div>
  );
};

export default BookingsModule;