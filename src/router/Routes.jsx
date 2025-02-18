import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login'; // Se agregó un componente separado para Login
import ProtectedRoute from '../components/common/ProtectedRoute';

import productRoutes from '../features/product/router/productRoutes';
import userRoutes from '../features/user/router/userRoutes';
import cuttingOrderRoutes from '../features/cuttingOrder/router/cuttingOrderRoutes';
import categoryRoutes from '../features/category/router/categoryRoutes';
import typeRoutes from '../features/type/router/typeRoutes';

const AppRoutes = () => (
  <Routes>
    {/* Rutas generales */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} /> {/* Se usa el nuevo componente Login */}

    {/* Ruta protegida del dashboard */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />

    {/* Rutas modulares */}
    {cuttingOrderRoutes?.map((route) => route)}
    {productRoutes?.map((route) => route)}
    {userRoutes?.map((route) => route)}
    {categoryRoutes?.map((route) => route)}
    {typeRoutes?.map((route) => route)}
  </Routes>
);

export default AppRoutes;
