import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import CuttingOrdersList from '../pages/CuttingOrdersList';
import CuttingOrderDetail from '../pages/CuttingOrderDetail';
import CuttingOrderCart from '../pages/CuttingOrderCart';

const cuttingOrderRoutes = [
  <Route
    key="cutting-orders"
    path="/cutting-orders"
    element={
      <ProtectedRoute>
        <CuttingOrdersList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="cutting-order-detail"
    path="/cutting-orders/:id"
    element={
      <ProtectedRoute>
        <CuttingOrderDetail />
      </ProtectedRoute>
    }
  />,
  <Route
    key="cutting-order-cart"
    path="/cutting-cart"
    element={
      <ProtectedRoute>
        <CuttingOrderCart />
      </ProtectedRoute>
    }
  />,
];
export default cuttingOrderRoutes;
