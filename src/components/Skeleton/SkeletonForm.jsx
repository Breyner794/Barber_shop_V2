import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonForm = () => {
  return (
    <div className="space-y-6">
      {/* Esqueleto del subtítulo */}
      <h3 className="text-2xl font-bold">
        <Skeleton width={250} />
      </h3>
      {/* Esqueleto para los 3 campos del formulario */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index}>
            <Skeleton width={120} /> {/* Para el label */}
            <Skeleton height={48} className="mt-1" /> {/* Para el input */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonForm;