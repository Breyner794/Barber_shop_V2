import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonDateButton = () => {
  return (
    // Clonamos el contenedor del botón de fecha real
    <div className="flex-shrink-0 text-center p-4 rounded-lg w-24 bg-gray-800">
      {/* Esqueleto para el día de la semana (ej: LUN) */}
      <p className="font-bold text-sm">
        <Skeleton width={30} />
      </p>
      {/* Esqueleto para el número del día (ej: 23) */}
      <p className="font-black text-2xl">
        <Skeleton height={28} width={40} />
      </p>
      {/* Esqueleto para el mes (ej: JUN) */}
      <p className="text-xs">
        <Skeleton width={30} />
      </p>
    </div>
  );
};

export default SkeletonDateButton;