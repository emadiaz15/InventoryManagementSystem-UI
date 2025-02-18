import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail';

const productRoutes = [
  <Route key="product-list" path="/product-list" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />,
  <Route key="product-detail" path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />,
];

export default productRoutes;
