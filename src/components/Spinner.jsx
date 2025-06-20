import React from 'react';

const Spinner = () => {
  return (
    <div 
      className="spinner h-12 w-12 rounded-full border-4 border-gray-700 border-t-blue-500"
      role="status" // Atributo de accesibilidad para indicar que es un elemento de carga
    >
      <span className="sr-only">Cargando...</span> {/* Texto para lectores de pantalla */}
    </div>
  );
};

export default Spinner;