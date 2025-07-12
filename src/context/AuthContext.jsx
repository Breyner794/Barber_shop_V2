import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../api/services'; // Importamos la función real

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(()=>{
    const checkLoggedInUser = async() =>{
      //console.log('AuthContext (useEffect): Iniciando checkLoggedInUser...');
      const token = localStorage.getItem('authToken');
      //console.log('AuthContext (useEffect): Token en localStorage:', token ? 'Existe' : 'No existe');
      if(!token){
        setIsAuthLoading(false);
         //console.log('AuthContext (useEffect): No hay token, isAuthLoading = false. Terminando.');
        return;
      }

      try{
        //console.log('AuthContext (useEffect): Token encontrado. Llamando a apiService.fetchMyProfile()...');
        const user = await apiService.fetchMyProfile();
         //console.log('AuthContext (useEffect): apiService.fetchMyProfile() completado. Resultado (variable user):', user);
        if (user) {
          setCurrentUser(user);
          //console.log('AuthContext (useEffect): currentUser establecido a:', user);
        } else {
          //console.warn('AuthContext (useEffect): fetchMyProfile devolvió un usuario nulo o indefinido.');
          localStorage.removeItem('authToken'); // Limpiar token si el usuario es nulo a pesar de que la llamada fue "exitosa"
          setCurrentUser(null);
        }
      }catch(error){
        // Si hay un error (ej. token expirado), limpiamos todo.
        console.error("Session check failed:", error);
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      }finally{
        setIsAuthLoading(false);
      }
    };
    checkLoggedInUser();
  },[]);

  // Función de Login que usarán los componentes
  const login = async (email, password) => {
    //console.log('AuthContext (login): Iniciando login...');
    setIsAuthLoading(true);
    try{
      const user = await apiService.loginUser({ email, password });
      setCurrentUser(user);
      //console.log('AuthContext (login): Login exitoso. Usuario establecido:', user);
      return user;
    }catch (error) {
        //console.error('AuthContext (login): Error durante el login:', error);
        setCurrentUser(null);
        localStorage.removeItem('authToken'); // Limpiar token en caso de login fallido
        throw error;
    } finally {
        setIsAuthLoading(false);
        //console.log('AuthContext (login): Finalizado login. isAuthLoading = false.');
    }
    
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