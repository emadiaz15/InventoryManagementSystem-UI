import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Asegúrate de que este hook esté correctamente implementado

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Obtenemos el estado de autenticación y carga

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (loading) {
    return <p>Cargando...</p>;
  }

  // Si no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza los hijos (el contenido protegido)
  return children;
};

export default ProtectedRoute;
