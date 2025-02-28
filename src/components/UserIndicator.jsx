import React from 'react';
import { useAuth } from '../context/AuthProvider';

const UserIndicator = () => {
  const { user } = useAuth();

  // Manejar el caso en el que `user` no esté definido o no tenga datos
  const userName = user?.name?.trim() || "Usuario";
  const userLastName = user?.last_name?.trim() || "";

  return (
    <span className="text-text-white font-semibold text-sm sm:text-base mr-2">
      {`${userName} ${userLastName}`.trim()}
    </span>
  );
};

export default UserIndicator;
