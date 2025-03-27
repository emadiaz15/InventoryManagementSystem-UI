import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

import ProductList from '../pages/ProductList';
import SubproductList from '../pages/SubproductList';
import ProductCommentsList from '../pages/ProductCommentsList';

const productRoutes = [
  <Route
    key="product-list"
    path="/product-list"
    element={
      <ProtectedRoute>
        <ProductList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="subproduct-list"
    path="/products/:productId/subproducts"
    element={
      <ProtectedRoute>
        <SubproductList />
      </ProtectedRoute>
    }
  />,
  <Route
    key="product-comments-list"
    path="/products/:prod_pk/comments"
    element={
      <ProtectedRoute>
        <ProductCommentsList />
      </ProtectedRoute>
    }
  />,
];

export default productRoutes;
