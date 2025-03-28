import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

import ProductList from '../pages/ProductList';
import SubproductList from '../pages/SubproductList';
import ProductStockEvent from '../pages/ProductStockEvent';
import SubproductStockEvent from '../pages/SubproductStockEvent';

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
    key="product-stock-events"
    path="/product-stock-history/:productId"
    element={
      <ProtectedRoute>
        <ProductStockEvent />
      </ProtectedRoute>
    }
  />,
  <Route
    key="subproduct-stock-history"
    path="/subproducts/:subproductId/stock-history"
    element={
      <ProtectedRoute>
        <SubproductStockEvent />
      </ProtectedRoute>
    }
  />
];

export default productRoutes;
