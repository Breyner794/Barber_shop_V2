import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonSummary = () => {
  const SummaryLine = () => (
    <div className="flex items-center gap-4">
      <Skeleton circle width={24} height={24} />
      <Skeleton width="80%" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Esqueleto del subtítulo */}
      <h3 className="text-2xl font-bold">
        <Skeleton width={280} />
      </h3>
      {/* Esqueleto del contenedor del resumen */}
      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SummaryLine key={index} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonSummary;