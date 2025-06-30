import React, { useState } from "react";
import { Plus, Clock, MapPin, Phone, Edit, Trash2, Search, Check, X } from "lucide-react";
import { mockData } from "../../data/mockData.js";

// Renombramos a SitesModule para mantener la consistencia (plural)
const SitesModule = () => {
  // --- LÓGICA DEL COMPONENTE ---
  const { sites } = mockData;
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado por nombre o dirección de la sede
  const filteredSites = sites.filter(site =>
    site.name_site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.address_site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Contenedor principal con el fondo oscuro y padding responsivo
    <div className="bg-gray-900 min-h-full p-4 sm:p-6">

      {/* --- CABECERA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center sm:text-left">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Manage Branches
          </span>
        </h2>
        <button 
          className="w-full sm:w-auto py-3 px-6 text-base font-bold rounded-lg transition-all duration-300 transform 
                     bg-gradient-to-r from-purple-500 to-indigo-600 text-white
                     hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Branch
        </button>
      </div>

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by branch name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* --- GRID DE TARJETAS DE SEDES (RESPONSIVO) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSites.map(site => (
          <div key={site.id} className="bg-gray-800 border-2 border-gray-700 rounded-2xl shadow-lg flex flex-col transition-all duration-300 hover:border-indigo-500/50 hover:scale-[1.02]">
            
            {/* --- Cabecera de la Tarjeta --- */}
            <div className="p-5 flex justify-between items-start border-b border-gray-700">
              <div>
                <p className="font-bold text-xl text-white">{site.name_site}</p>
              </div>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                ${site.isActive 
                  ? 'bg-green-500/10 text-green-300 border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                {site.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {site.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* --- Cuerpo de la Tarjeta (Detalles de Contacto) --- */}
            <div className="p-5 space-y-4 flex-grow">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="font-medium text-white">{site.address_site}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="font-medium text-white">{site.phone_site}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-400">Hours</p>
                  <p className="font-medium text-white">{site.headquarter_time}</p>
                </div>
              </div>
            </div>
            
            {/* --- Pie de la Tarjeta (Acciones) --- */}
            <div className="p-3 bg-gray-900/50 border-t border-gray-700 flex justify-end gap-2">
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
      {filteredSites.length === 0 && (
        <div className="text-center py-16 col-span-full">
          <p className="text-xl font-semibold text-gray-300">No branches found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
        </div>
      )}

    </div>
  );
};

export default SitesModule;