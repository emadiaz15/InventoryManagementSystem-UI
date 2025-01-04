import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Importar las rutas de las features
import productRoutes from '../features/product/router/productRoutes'; 
import userRoutes from '../features/user/router/userRoutes'; 
import cuttingOrderRoutes from '../features/cuttingOrder/router/cuttingOrderRoutes'; // Ajuste al nombre para claridad
import categoryRoutes from '../features/category/router/categoryRoutes';
import typeRoutes from '../features/type/router/typeRoutes';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Rutas generales */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Home />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

      {/* Rutas modulares */}
      {cuttingOrderRoutes}    {/* Rutas del módulo de Órdenes de Corte */}
      {productRoutes}         {/* Rutas del módulo de Productos */}
      {userRoutes}            {/* Rutas del módulo de Usuarios */}
      {categoryRoutes}        {/* Rutas del módulo de Categorías */}
      {typeRoutes}            {/* Rutas del módulo de Tipos */}
    </Routes>
  </Router>
);

export default AppRoutes;
