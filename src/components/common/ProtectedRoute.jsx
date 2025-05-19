import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import Spinner from '../ui/Spinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background-100">
        <Spinner size="8" color="text-primary-500" aria-label="Cargando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // No está logueado → login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user?.is_staff) {
    // Está logueado pero no es staff → unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Si vienen hijos explícitos, los renderiza; si no, renderiza las rutas anidadas via <Outlet/>
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
