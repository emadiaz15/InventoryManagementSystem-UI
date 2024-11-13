import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../../../components/common/ProtectedRoute';

import UserList from '../pages/UserList';
import UserProfile from '../pages/UserProfile';
import MyProfile from '../pages/MyProfile';

const userRoutes = (
  <>
    <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
    <Route path="/users-list" element={<ProtectedRoute><UserList /></ProtectedRoute>} /> {/* Ruta protegida para UserList */}
    <Route path="/users/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
  </>
);

export default userRoutes;
