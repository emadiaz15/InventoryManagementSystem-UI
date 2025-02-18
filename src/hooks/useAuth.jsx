import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../features/user/services/auth/loginUser';
import { logoutUser } from '../features/user/services/auth/logoutUser';
import api from '../services/api'; // Asegurar que importamos la instancia de Axios

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Intentar acceder al perfil del usuario para verificar si el token es válido
        await api.get('/users/profile/', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.warn('Token expirado. Intentando refrescar...', err);

        if (refreshToken) {
          try {
            const { data } = await api.post('/users/refresh/', { refresh: refreshToken });
            localStorage.setItem('access_token', data.access);
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error('Error al refrescar el token:', refreshError);
            logout();
          }
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      console.log('Backend response:', data);
  
      if (data?.access_token && data?.refresh_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        
        // Asegurar que los tokens se guardan antes de cambiar el estado
        setTimeout(() => {
          setIsAuthenticated(true);
          navigate('/dashboard'); // Redirigir al Dashboard
        }, 100);
      } else {
        setError('Authentication error. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error during login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout request failed, but clearing session anyway:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token'); 
      setIsAuthenticated(false);
      navigate('/login'); // Redirigir al login
    }
  };
  
  const validateToken = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
  
    if (!accessToken) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
  
    try {
      // Intentar acceder al perfil del usuario para verificar si el token es válido
      await api.get('/users/profile/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setIsAuthenticated(true);
    } catch (err) {
      console.warn('Token expired. Attempting to refresh...', err);
  
      if (refreshToken) {
        try {
          const { data } = await api.post('/users/refresh/', { refresh: refreshToken });
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            setIsAuthenticated(true);
            return;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
  
      logout(); // Si el refresh falla, cerrar sesión
    } finally {
      setLoading(false);
    }
  };
  
  return {
    isAuthenticated,
    login,
    logout,
    loading,
    error,
    validateToken,
  };
};
