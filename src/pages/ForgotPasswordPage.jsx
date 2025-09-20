import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Mail, Send, AlertTriangle, CheckCircle, LoaderCircle, ArrowLeft } from 'lucide-react';
import apiService from '../api/services';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
        const data = await apiService.forgotPassword(email);
        setEmail('');
        setMessage(data.message || 'Si existe una cuenta con este email, se ha enviado un enlace de recuperación.');
        setEmailSent(true);
    } catch (err) {
      setError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen text-white">
        <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
          <div className="text-center">
            <div className="inline-block p-3 bg-green-600/20 rounded-full mb-4 border border-green-500/30">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Email Enviado</h1>
            <p className="text-gray-300 mb-6">
              Si existe una cuenta con este email, se ha enviado un enlace de recuperación.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <div className="space-y-4">
              <Link
                to="/login"
                className="w-full gap-2 py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
                      bg-gradient-to-r from-blue-500 to-blue-600 text-white
                      hover:scale-105 flex justify-center items-center hover:shadow-lg hover:shadow-blue-500/30"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Login
              </Link>
              <button
                onClick={() => {
                  setEmailSent(false);
                  setMessage('');
                }}
                className="w-full py-2 px-4 text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
              >
                Enviar a otro email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
          <div className="inline-block p-3 bg-blue-600/20 rounded-full mb-4 border border-blue-500/30">
            <Scissors className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white">Recuperar Contraseña</h1>
          <p className="mt-2 text-gray-400">
            Ingresa tu email para recibir instrucciones de recuperación
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 rounded-md bg-green-500/10 text-green-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {message}
            </div>
          )}

          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 text-white pl-12 pr-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
                <Send className="w-5 h-5" />
              )}
              {isLoading ? "Enviando..." : "Enviar Email de Recuperación"}
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

export default ForgotPasswordPage;