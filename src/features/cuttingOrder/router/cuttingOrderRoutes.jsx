import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import CuttingOrders from '../pages/CuttingOrders';
import CuttingOrderDetail from '../pages/CuttingOrderDetail';

const cuttingOrderRoutes = [
  <Route key="cutting-orders" path="/cutting-orders" element={<ProtectedRoute><CuttingOrders /></ProtectedRoute>} />,
  <Route key="cutting-order-detail" path="/cutting-orders/:id" element={<ProtectedRoute><CuttingOrderDetail /></ProtectedRoute>} />,
];

export default cuttingOrderRoutes;
