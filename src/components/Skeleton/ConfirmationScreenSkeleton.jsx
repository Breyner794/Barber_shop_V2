import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProgressBar from '../ProgressBar';
import SkeletonForm from './SkeletonForm';
import SkeletonSummary from './SkeletonSummary';
import SkeletonButtonGroup from './SkeletonButtonGroup';
import Header from '../Header';
import Footer from '../Footer';

const ConfirmationScreenSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
        <Header/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
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
      <Footer/>
      </div>
    </SkeletonTheme>
  );
};

export default ConfirmationScreenSkeleton;