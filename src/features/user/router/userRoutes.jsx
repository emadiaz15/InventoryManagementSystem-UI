import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../../../components/common/ProtectedRoute';
import UserList from '../pages/UserList';

const userRoutes = [
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
