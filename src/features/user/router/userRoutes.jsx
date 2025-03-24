// src/features/user/router/userRoutes.js
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import MyProfile from '../pages/MyProfile';
import UserList from '../pages/UserList';

const userRoutes = [
  <Route
    key="my-profile"
    path="/my-profile"
    element={
      <ProtectedRoute>
        <MyProfile />
      </ProtectedRoute>
    }
  />,
  <Route
    key="users-list"
    path="/users-list"
    element={
      <ProtectedRoute>
        <UserList />
      </ProtectedRoute>
    }
  />,
];

export default userRoutes;
