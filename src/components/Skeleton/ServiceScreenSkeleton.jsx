import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; 
import ProgressBar from '../ProgressBar';
import SkeletonCard from './SkeletonCard';
import Header from '../Header';
import Footer from '../Footer';

const ServiceScreenSkeleton = () => {
  return (
    // SkeletonTheme es CLAVE para que se vea bien en fondos oscuros
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-6 lg:pt-10 ">
        <div className="max-w-4xl mx-auto">
          {/* 1. Esqueleto para el Título */}
          <h2 className="text-3xl md:text-4xl font-black text-center mb-8 lg:mb-12">
            <Skeleton width={350} height={40} />
          </h2>

          {/* 2. Tu Barra de Progreso (esta no necesita esqueleto) */}
          <ProgressBar currentStep={1} />

          {/* 3. Grid de Tarjetas Esqueleto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Repetimos la tarjeta esqueleto varias veces para simular la lista */}
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>

          {/* 4. Esqueleto para el Botón Continuar */}
          <div className="mt-10 lg:mt-12">
            <Skeleton height={56} borderRadius={8} />
          </div>
        </div>
        </main>
        <Footer/>
      </div>
    </SkeletonTheme>
  );
};

export default ServiceScreenSkeleton;