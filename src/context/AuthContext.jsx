import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../api/services'; // Importamos la función real

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(()=>{
    const checkLoggedInUser = async() =>{
      const token = localStorage.getItem('authToken');
      if(!token){
        setIsAuthLoading(false);
        return;
      }

      try{
        const user = await apiService.fetchMyProfile();
        setCurrentUser(user);
      }catch(error){
        // Si hay un error (ej. token expirado), limpiamos todo.
        console.error("Session check failed:", error);
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      }finally{
        setIsAuthLoading(false);
      }
    };
    checkLoggedInUser(false);
  },[]);

  // Función de Login que usarán los componentes
  const login = async (email, password) => {
    const user = await apiService.loginUser({ email, password });
    setCurrentUser(user);
    return user;
  };

  // Función de Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    setCurrentUser,
    isAuthenticated: !!currentUser, // Un booleano útil: true si hay usuario, false si no.
    isAuthLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};