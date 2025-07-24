// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Asumimos que AuthContext estará en esta ruta
import { useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirige al dashboard después del login exitoso
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-black to-blue-700 flex items-center justify-center min-h-screen  text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-black rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
            <div className="inline-block p-3 bg-blue-600/20 rounded-full mb-4 border border-blue-500/30">
                 <Scissors className="w-10 h-10 text-blue-400" />
            </div>
          <h1 className="text-3xl font-black text-white">Welcome Back</h1>
          <p className="mt-2 text-gray-400">
            Log in to your BarberPro dashboard
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 text-white pl-12 pr-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 text-white pl-12 pr-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 transform 
                         bg-gradient-to-r from-blue-500 to-blue-600 text-white
                         hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30
                         disabled:bg-gray-700 disabled:scale-100 disabled:shadow-none disabled:cursor-wait"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;