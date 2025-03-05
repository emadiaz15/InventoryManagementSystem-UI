import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

import ProductList from '../pages/ProductList';
import SubproductList from '../pages/SubproductList';

const productRoutes = [
  <Route key="product-list" path="/product-list" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />,
  <Route key="subproduct-list" path="/products/:productId" element={<ProtectedRoute><SubproductList /></ProtectedRoute>} />,
];

export default productRoutes;
