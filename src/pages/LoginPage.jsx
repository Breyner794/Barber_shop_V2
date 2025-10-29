import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Mail, Lock, LogIn, AlertTriangle, LoaderCircle } from 'lucide-react';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isAuthLoading } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect (() => {
    if(!isAuthLoading && isAuthenticated){
      navigate('/dashboard', {replace: true});
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen text-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-4 sm:mx-auto p-6 sm:p-8 space-y-6 sm:space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
            <div className="inline-block p-3 bg-blue-600/20 rounded-full mb-4 border border-blue-500/30">
                 <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Bienvenido de nuevo</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400 px-2">
            Inicie sesión en su panel de control de BarberPro
          </p>
        </div>
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-xs sm:text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="relative">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 text-white text-sm sm:text-base pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 text-white text-sm sm:text-base pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2 py-2.5 sm:py-3 px-4 sm:px-6 text-base sm:text-lg font-bold rounded-lg transition-all duration-300 transform 
                    bg-gradient-to-r from-blue-500 to-blue-600 text-white
                    hover:scale-105 active:scale-95 flex justify-center items-center hover:shadow-lg hover:shadow-blue-500/30
                    disabled:bg-gray-700 disabled:scale-100 disabled:shadow-none disabled:cursor-wait disabled:opacity-70"
            >
              {isLoading ? (
                <LoaderCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
              <span>{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}</span>
            </button>
          </div>

          {/* Enlace para recuperar contraseña */}
          {/* <div className="text-center">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div> */}

        </form>
      </div>
    </div>
  );
};

export default LoginPage;