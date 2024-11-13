import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import CuttingOrders from '../pages/CuttingOrders'
import CuttingOrderDetail from '../pages/CuttingOrderDetail';

const cuttingOrder = (
  <>
    <Route path="/cutting-orders" element={<ProtectedRoute><CuttingOrders /></ProtectedRoute>} />
    <Route path="/cutting-orders/:id" element={<ProtectedRoute><CuttingOrderDetail /></ProtectedRoute>} />
  </>
);

export default cuttingOrder;
