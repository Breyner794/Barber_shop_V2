// src/components/Dashboard/Availability/BarberSelector.jsx

import React, { useState, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import useOnClickOutside from '../../../hook/useOnClickOutside';

const BarberSelector = ({ barbers, selectedBarber, onSelect, currentUser, isPrivileged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Usamos el hook para cerrar el menú al hacer clic fuera
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const filteredBarbers = barbers.filter(barber =>
    `${barber.name} ${barber.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (barber) => {
    onSelect(barber._id);
    setIsOpen(false);
  };

  const displayUser = isPrivileged ? selectedBarber : currentUser;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-sm text-gray-400">Mostrando disponibilidad para</label>
      
      {/* Botón que muestra la selección actual y abre el menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!isPrivileged}
        className="w-full mt-1 p-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl flex items-center justify-between text-left disabled:opacity-70 disabled:cursor-not-allowed hover:border-blue-500/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <img
            src={displayUser?.imageUrl}
            alt={displayUser?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
          />
          <div>
            <p className="font-bold text-lg text-white">{displayUser?.name} {displayUser?.last_name}</p>
            {!isPrivileged && <p className="text-xs text-gray-400">(Tu horario)</p>}
          </div>
        </div>
        {isPrivileged && (
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Panel del menú desplegable con opciones */}
      {isPrivileged && isOpen && (
        <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in-down">
          {/* Barra de búsqueda dentro del menú */}
          <div className="p-2 border-b border-gray-700">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar peluquer@ ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-900 text-white pl-9 pr-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Lista de opciones */}
          <div className="max-h-60 overflow-y-auto">
            {filteredBarbers.length > 0 ? (
              filteredBarbers.map(barber => (
                <button
                  key={barber._id}
                  onClick={() => handleSelect(barber)}
                  className={`w-full text-left p-3 flex items-center cursor-pointer gap-3 transition-colors ${selectedBarber?._id === barber._id ? 'bg-blue-600/50' : 'hover:bg-gray-700/50'}`}
                >
                  <img src={barber.imageUrl} alt={barber.name} className="w-8 h-8 rounded-full object-cover" />
                  <span>{barber.name} {barber.last_name}</span>
                </button>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm p-4">No se encontraron peluquer@s.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberSelector;