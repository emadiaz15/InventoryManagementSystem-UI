import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import TypesList from '../pages/TypeList';

const typeRoutes = [
  <Route key="types-list" path="/types" element={<ProtectedRoute><TypesList /></ProtectedRoute>} />,
];

export default typeRoutes;
