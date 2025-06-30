import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const UserInfoCard = ({ label, value }) => {
  const renderValue = () => {
    if (label === 'Contraseña') return '••••••••';
    if (label === 'Rol') {
      return value === true || value === 'Sí' || value === 'Administrador'
        ? 'Administrador'
        : 'Operario';
    }
    return value ?? 'N/A';
  };

  return (
    <div className="flex items-center bg-background-100 text-text-primary border-background-200 rounded-2xl shadow-sm p-4 w-full">
      <UserIcon className="h-5 w-5 text-primary-500 mr-3" />
      <div>
        <p className="text-sm text-text-secondary font-medium">{label}</p>
        <p className="text-lg font-semibold">{renderValue()}</p>
      </div>
    </div>
  );
};

export default UserInfoCard;
