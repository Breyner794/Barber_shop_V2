import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectNotice = ({ message, redirectTo, countdown = 3 }) => {
  const [counter, setCounter] = useState(countdown);
  const navigate = useNavigate();

  // Efecto para la cuenta regresiva
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);

    // Limpieza del intervalo cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []); // El array vacío asegura que esto solo se ejecute una vez

  // Efecto para redirigir cuando el contador llegue a 0
  useEffect(() => {
    if (counter === 0) {
      navigate(redirectTo, { replace: true });
    }
  }, [counter, navigate, redirectTo]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center text-center p-4">
      <div className="max-w-md">
        <svg
          className="mx-auto h-16 w-16 text-yellow-500 mb-4 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold mb-2">Un momento...</h1>
        <p className="text-gray-300 text-lg">{message}</p>
        <p className="text-gray-500 mt-4">
          Serás redirigido en {counter} segundos...
        </p>
      </div>
    </div>
  );
};

export default RedirectNotice;