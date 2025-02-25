import React from 'react';
import { useAuth } from '../context/AuthProvider';

const UserDropdown = () => {
  const { user } = useAuth();

  return (
    <span className="text-white font-semibold text-sm sm:text-base mr-2">
      {user ? `${user.name} ${user.last_name}` : 'Usuario'}
    </span>
  );
};

export default UserDropdown;
