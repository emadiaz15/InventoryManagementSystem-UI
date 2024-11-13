import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir después de login
import { loginUser } from '../features/user/services/auth/loginUser'; // Servicio de login
import { logoutUser } from '../features/user/services/auth/logoutUser'; // Servicio de logout

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error
  const navigate = useNavigate(); // Para redirigir al dashboard

  // Verificar si el token existe en localStorage al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true); // Autenticado si hay token
    } else {
      setIsAuthenticated(false); // No autenticado si no hay token
    }
    setLoading(false); // Terminamos de cargar la autenticación
  }, []); // Solo lo hacemos al montar el componente

  // Función de login
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(credentials); // Llamamos al servicio de login
      if (data && data.access) {
        localStorage.setItem('access_token', data.access); // Guardamos el token en localStorage
        setIsAuthenticated(true); // Usuario autenticado
        navigate('/dashboard'); // Redirigimos al dashboard
      } else {
        setError('Error en la autenticación');
      }
    } catch (err) {
      setError('Error en el login');
      console.error('Error en el login:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    logoutUser(); // Llamamos al servicio de logout
    localStorage.removeItem('access_token'); // Eliminamos el token de localStorage
    setIsAuthenticated(false); // Actualizamos el estado de autenticación
    navigate('/'); // Redirigimos al home después del logout
  };

  return {
    isAuthenticated,
    login, // Retornamos la función de login
    logout, // Retornamos la función de logout
    loading, // Retornamos el estado de carga
    error, // Retornamos el estado de error
  };
};
