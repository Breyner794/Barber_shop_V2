import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const ServiceImage = ({ 
  src, 
  alt,
  className = "w-full h-48 object-cover"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const hasValidUrl = src && src.trim() !== '';
  const shouldShowImage = hasValidUrl && !imageError;

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  if (!shouldShowImage) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center border-b-2 border-gray-700">
        <ImageOff className="w-16 h-16 text-gray-600 mb-3" />
        <p className="text-gray-500 text-sm font-medium">Sin imagen disponible</p>
        <p className="text-gray-600 text-xs mt-1">{alt}</p>
      </div>
    );
  }

  // Mostrar imagen
  return (
    <div className="relative">

      {imageLoading && (
        <div className="absolute inset-0 w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default ServiceImage;