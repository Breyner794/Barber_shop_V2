import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonCard = () => {
  return (
    // Usamos las mismas clases de la tarjeta real para mantener la estructura
    <div className="bg-gray-800 border-2 border-gray-700 rounded-lg flex flex-col overflow-hidden">
      {/* Esqueleto para la imagen */}
      <Skeleton height={192} /> {/* h-48 es 192px */}
      
      {/* Esqueleto para el texto */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          {/* Esqueleto para el nombre del servicio */}
          <Skeleton width="70%" height={24} /> 
          {/* Esqueleto para la duración */}
          <Skeleton width="40%" className="mt-2" />
        </div>
        {/* Esqueleto para el precio */}
        <div className="mt-4 self-end">
          <Skeleton width={90} height={30} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;