import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import ProtectedRoute from '../components/common/ProtectedRoute';

import cuttingOrderRoutes from '../features/cuttingOrder/router/cuttingOrderRoutes';
import productRoutes from '../features/product/router/productRoutes';
import userRoutes from '../features/user/router/userRoutes';
import categoryRoutes from '../features/category/router/categoryRoutes';
import typeRoutes from '../features/type/router/typeRoutes';

const AppRoutes = () => (
  <Routes>
    {/* Rutas generales */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    {/* Ejemplo de ruta protegida suelta */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    {/* Rutas modulares: simplemente inyectamos los arrays de <Route> */}
    {cuttingOrderRoutes}
    {productRoutes}
    {userRoutes}
    {categoryRoutes}
    {typeRoutes}
  </Routes>
);

export default AppRoutes;
