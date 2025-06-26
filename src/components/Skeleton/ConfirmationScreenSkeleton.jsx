// src/components/ConfirmationScreenSkeleton.jsx
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import ProgressBar from '../ProgressBar';
import SkeletonForm from './SkeletonForm';
import SkeletonSummary from './SkeletonSummary';
import SkeletonButtonGroup from './SkeletonButtonGroup';

const ConfirmationScreenSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="max-w-4xl w-full">
          {/* --- ESQUELETO DEL HEADER --- */}
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8">
            <Skeleton width={450} height={40} />
          </h2>
          <ProgressBar currentStep={5} />

          {/* --- ESQUELETO DEL CONTENIDO PRINCIPAL (2 COLUMNAS) --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
            <SkeletonForm />
            <SkeletonSummary />
          </div>

          {/* --- ESQUELETO DE LOS BOTONES --- */}
          <SkeletonButtonGroup />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default ConfirmationScreenSkeleton;