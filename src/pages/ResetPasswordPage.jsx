import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Scissors, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, LoaderCircle, ArrowLeft } from 'lucide-react';
import apiService from '../api/services'; // Ajusta la ruta según tu estructura

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token válido
    if (!token) {
      setTokenValid(false);
      setError('Token de recuperación no encontrado');
    }
  }, [token]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validaciones del frontend
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiService.resetPassword(token, password);
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
    } catch (err) {
      setError(err.message || 'Error al restablecer la contraseña');
      if (err.message?.includes('Token inválido o expirado')) {
          setTokenValid(false);
        }
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen text-white">
        <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
          <div className="text-center">
            <div className="inline-block p-3 bg-green-600/20 rounded-full mb-4 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">¡Contraseña Actualizada!</h1>
            <p className="text-gray-300 mb-6">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Serás redirigido al login automáticamente...
            </p>
            <Link
              to="/login"
              className="w-full gap-2 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
                    bg-gradient-to-r from-blue-500 to-blue-600 text-white
                    hover:scale-105 flex justify-center items-center hover:shadow-lg hover:shadow-blue-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
              Ir al Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de token inválido
  if (!tokenValid) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen text-white">
        <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
          <div className="text-center">
            <div className="inline-block p-3 bg-red-600/20 rounded-full mb-4 border border-red-500/30">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Link Inválido</h1>
            <p className="text-gray-300 mb-6">
              El enlace de recuperación es inválido o ha expirado.
            </p>
            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="w-full gap-2 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
                      bg-gradient-to-r from-blue-500 to-blue-600 text-white
                      hover:scale-105 flex justify-center items-center hover:shadow-lg hover:shadow-blue-500/30
                      inline-block text-center"
              >
                Solicitar Nuevo Enlace
              </Link>
              <Link
                to="/login"
                className="w-full gap-2 py-2 px-4 text-gray-400 hover:text-white transition-colors duration-200 
                       flex justify-center items-center underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla principal de restablecimiento
  return (
    <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
          <div className="inline-block p-3 bg-blue-600/20 rounded-full mb-4 border border-blue-500/30">
            <Scissors className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Nueva Contraseña</h1>
          <p className="mt-2 text-gray-400">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 text-white pl-12 pr-12 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar Nueva Contraseña"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-900/50 text-white pl-12 pr-12 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full gap-2 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
                    bg-gradient-to-r from-blue-500 to-blue-600 text-white
                    hover:scale-105 flex justify-center items-center hover:shadow-lg hover:shadow-blue-500/30
                    disabled:bg-gray-700 disabled:scale-100 disabled:shadow-none disabled:cursor-wait"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
            </button>

            <Link
              to="/login"
              className="w-full gap-2 py-2 px-4 text-gray-400 hover:text-white transition-colors duration-200 
                     flex justify-center items-center underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;