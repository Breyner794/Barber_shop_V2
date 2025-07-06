import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProgressBar from "../ProgressBar";
import SkeletonDateButton from "./SkeletonDateButton";
import SkeletonTimeSlot from "./SkeletonTimeSlot";
import SkeletonButtonGroup from "./SkeletonButtonGroup";
import Footer from "../Footer";
import Header from "../Header";

const DateTimeScreenSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#2D3748" highlightColor="#4A5568">
      <div className="bg-gradient-to-tr from-gray-900 via-blue-700 to-black text-white min-h-screen flex flex-col">
        <Header/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* --- ESQUELETO DEL HEADER --- */}
          <h2 className="text-3xl md:text-4xl font-black text-center mb-4">
            <Skeleton width={400} height={40} />
          </h2>
          <ProgressBar currentStep={4} />

          {/* --- ESQUELETO DEL CARRUSEL DE FECHAS --- */}
          <div className="mb-8 mt-8">
            <p className="font-bold mb-4 text-lg"><Skeleton width={200} /></p>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonDateButton key={index} />
              ))}
            </div>
          </div>

          {/* --- ESQUELETO DE LA PARRILLA DE HORARIOS --- */}
          <div>
            <p className="font-bold mb-4 text-lg"><Skeleton width={300} /></p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonTimeSlot key={index} />
              ))}
            </div>
          </div> 

          {/* --- ESQUELETO DE LOS BOTONES DE NAVEGACIÓN --- */}
          <SkeletonButtonGroup />
        </div>
      </div>
      <Footer/>
      </div>
    </SkeletonTheme>
  );
};

export default DateTimeScreenSkeleton;