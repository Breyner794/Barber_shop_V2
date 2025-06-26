import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonTimeSlot = () => {
  // Coincide con el 'p-3', 'font-bold' y 'rounded-lg' del botón real
  return <Skeleton height={46} borderRadius={8} />;
};

export default SkeletonTimeSlot;