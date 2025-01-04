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
    setIsAuthenticated(!!token); // Autenticado si hay token, caso contrario no
    setLoading(false); // Terminamos de cargar la autenticación
  }, []); // Solo lo hacemos al montar el componente

  // Función de login
  const login = async (credentials) => {
    setError(null); // Reiniciar error
    setLoading(true); // Mostrar estado de carga
    try {
      const data = await loginUser(credentials); // Llamamos al servicio de login
      if (data?.access) {
        localStorage.setItem('access_token', data.access); // Guardamos el token en localStorage
        setIsAuthenticated(true); // Usuario autenticado
        navigate('/dashboard'); // Redirigimos al dashboard
      } else {
        setError('Authentication error. Please try again.'); // Mensaje de error si el login falla
      }
    } catch (err) {
      setError('Error during login. Please check your credentials.'); // Mensaje genérico para el usuario
      console.error('Login error:', err); // Log más detallado para desarrollo
    } finally {
      setLoading(false); // Terminamos el estado de carga
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await logoutUser(); // Llamamos al servicio de logout
    } catch (err) {
      console.error('Error during logout:', err); // Registrar errores del backend (opcional)
    } finally {
      localStorage.removeItem('access_token'); // Eliminamos el token de localStorage
      setIsAuthenticated(false); // Actualizamos el estado de autenticación
      navigate('/'); // Redirigimos al home después del logout
    }
  };

  return {
    isAuthenticated, // Devuelve el estado de autenticación
    login, // Función de login
    logout, // Función de logout
    loading, // Estado de carga
    error, // Estado de error
  };
};
