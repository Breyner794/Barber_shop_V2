import React, { useState, useEffect } from 'react';
import { LoaderCircle, Scissors, Lock, ShieldCheck } from 'lucide-react';

const AuthLoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  const messages = [
    { text: 'Verificando credenciales', icon: Lock },
    { text: 'Cargando sesión', icon: ShieldCheck },
    { text: 'Preparando tu espacio', icon: Scissors }
  ];

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(dotsTimer);
  }, []);

  const CurrentIcon = messages[messageIndex].icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black to-blue-700">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse top-1/4 left-1/4"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse bottom-1/4 right-1/4 delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative bg-gray-800/50 backdrop-blur-sm p-8 rounded-full border border-blue-500/30">
            <Scissors className="w-16 h-16 text-blue-400" />
          </div>
        </div>

        <div className="relative">
          <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin" />
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md animate-pulse"></div>
        </div>

        <div className="flex flex-col items-center space-y-4 min-h-[80px]">
          <div className="flex items-center space-x-3 bg-gray-800/30 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-500/20">
            <CurrentIcon className="w-5 h-5 text-blue-400 animate-pulse" />
            <p className="text-lg font-medium text-gray-100">
              {messages[messageIndex].text}
              <span className="inline-block w-8 text-left text-blue-400">{dots}</span>
            </p>
          </div>

          <div className="w-64 h-1 bg-gray-700/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <p className="text-sm text-white-400 animate-pulse">
          Por favor espera un momento...
        </p>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;