import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import CategoriesList from '../pages/CategoriesList';

const categoryRoutes = [
  <Route
    key="categories-list"
    path="/categories"
    element={
      <ProtectedRoute>
        <CategoriesList />
      </ProtectedRoute>
    }
  />,
];

export default categoryRoutes;
