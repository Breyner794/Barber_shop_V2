import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoaderCircle } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthLoading} = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Si ya no estamos cargando Y el usuario no está autenticado, redirigimos
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está bien, mostramos la página solicitada
  return children;
};

export default ProtectedRoute;