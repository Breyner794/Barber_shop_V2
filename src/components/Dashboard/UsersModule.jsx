import React, { useState } from 'react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, Trash2, Edit, Eye, Search, ShieldCheck, MapPin, LogIn, Activity } from "lucide-react";
import { mockData } from "../../data/mockData.js";

const UsersModule = () => {
  // --- LÓGICA DEL COMPONENTE ---
  const { users } = mockData;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    `${user.name_barber} ${user.last_name_barber}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Contenedor principal con el fondo oscuro y padding responsivo
    <div className="bg-gray-900 min-h-full p-4 sm:p-6">

      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
            Manage Users
          </span>
        </h2>
        <button 
          className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform 
                     bg-gradient-to-r from-orange-500 to-amber-600 text-white
                     hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New User
        </button>
      </div>
      
      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* --- GRID DE TARJETAS DE USUARIO (RESPONSIVO) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:border-amber-500/50 hover:scale-[1.02]">
            
            {/* --- Cabecera de la Tarjeta --- */}
            <div className="p-5 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-4">
                <img
                  className="h-14 w-14 rounded-full object-cover border-2 border-gray-600"
                  src={user.imageUrl}
                  alt={`${user.name_barber} ${user.last_name_barber}`}
                />
                <div>
                  <p className="font-bold text-lg text-white">{user.name_barber} {user.last_name_barber}</p>
                  <p className="text-sm text-gray-400">ID: {user.id_barber}</p>
                </div>
              </div>
              {/* --- Botones de acción en la cabecera --- */}
              <div className="flex gap-1">
                <button className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"><Eye className="w-5 h-5" /></button>
                <button className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"><Edit className="w-5 h-5" /></button>
                <button className="p-2 rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>

            {/* --- Cuerpo de la Tarjeta (Detalles) --- */}
            <div className="p-5 space-y-4 flex-grow">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">Role:</p>
                <span className="font-medium capitalize px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">Branch:</p>
                <p className="font-medium text-white">{user.siteName || 'Not Assigned'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">Status:</p>
                <span className={`font-medium capitalize px-2 py-0.5 text-xs rounded-full border
                  ${user.isActive 
                    ? 'bg-green-500/10 text-green-300 border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <LogIn className="w-5 h-5 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Last Login</p>
                  {user.last_login ? (
                    <>
                      <p className="font-medium text-white">{format(parseISO(user.last_login), 'MMMM d, yyyy @ hh:mm a')}</p>
                      <p className="text-xs text-gray-500">
                        ({formatDistanceToNow(parseISO(user.last_login), { addSuffix: true, locale: enUS })})
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-gray-500 italic">Never</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Mensaje por si no hay resultados --- */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-xl font-semibold text-gray-300">No users found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export default UsersModule;