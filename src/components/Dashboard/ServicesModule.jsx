import React, { useState } from 'react';
import { Plus, Trash2, Edit, Search, Clock, Tag, Check, X } from "lucide-react";
import { mockData } from '../../data/mockData.js';

const ServicesModule = () => {
  // --- LÓGICA DEL COMPONENTE ---
  // Mover la lógica y el estado dentro del componente es una buena práctica.
  const { services } = mockData;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Contenedor principal con el fondo oscuro y padding responsivo
    <div className="bg-gray-900 min-h-full p-4 sm:p-6">
      
      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-400">
            Manage Services
          </span>
        </h2>
        <button 
          className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform 
                     bg-gradient-to-r from-teal-500 to-green-600 text-white
                     hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Service
        </button>
      </div>

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for a service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* --- GRID DE TARJETAS DE SERVICIO (RESPONSIVO) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service.id} className="bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:border-green-500/50 hover:scale-[1.02]">
            
            {/* --- Imagen de la Tarjeta --- */}
            <div className="relative">
                <img
                  src={service.image_Url}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                {/* --- Badge de Estado sobre la imagen --- */}
                <span className={`absolute top-4 right-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                  ${service.isActive 
                    ? 'bg-green-500/10 text-green-300 border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {service.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            
            {/* --- Contenido de la Tarjeta --- */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white">{service.name}</h3>
                <p className="text-gray-400 mt-2 text-sm leading-relaxed">{service.description}</p>
              </div>

              {/* --- Detalles (Precio y Duración) --- */}
              <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-gray-300">
                    <Tag className="w-5 h-5 text-green-400" />
                    <p className="text-lg font-semibold text-white">
                        ${service.price.toLocaleString('es-CO')}
                    </p>
                 </div>
                 <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5 text-green-400" />
                    <p className="font-medium">{service.duration} min</p>
                 </div>
              </div>
            </div>

            {/* --- Pie de la Tarjeta (Acciones) --- */}
            <div className="p-3 bg-gray-900/50 flex justify-end gap-2">
                <button className="flex-1 bg-gray-700/50 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button className="p-3 text-red-500 bg-gray-700/50 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
            </div>

          </div>
        ))}
      </div>

      {/* --- Mensaje por si no hay resultados --- */}
      {filteredServices.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-xl font-semibold text-gray-300">No services found</p>
          <p className="text-gray-500 mt-2">No service matches your search for "{searchTerm}".</p>
        </div>
      )}
    </div>
  );
};

export default ServicesModule;