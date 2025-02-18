import React from 'react';
import { Route } from 'react-router-dom';

import ProtectedRoute from '../../../components/common/ProtectedRoute';

import UserList from '../pages/UserList';
import UserProfile from '../pages/UserProfile';
import MyProfile from '../pages/MyProfile';

const userRoutes = [
  <Route key="my-profile" path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />,
  <Route key="users-list" path="/users-list" element={<ProtectedRoute><UserList /></ProtectedRoute>} />, 
  <Route key="user-profile" path="/users/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />,
];

export default userRoutes;
