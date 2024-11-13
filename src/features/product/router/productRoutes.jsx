import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../../../components/common/ProtectedRoute';

import ProductList from '../pages/ProductList';
import ProductDetail from '../pages/ProductDetail'; 

const productRoutes = (
  <>
      <Route path="/product-list" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
  </>
);

export default productRoutes;
