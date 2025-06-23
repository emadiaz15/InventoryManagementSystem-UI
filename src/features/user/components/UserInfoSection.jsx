import React from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const UserInfoSection = ({ user }) => {
  if (!user) return null;

  const userFields = [
    { label: 'Correo Electrónico', value: user?.email || 'N/A' },
    { label: 'DNI', value: user?.dni || 'N/A' },
    { label: 'Activo', value: user?.is_active ? 'Sí' : 'No' },
    { label: 'Rol', value: user?.is_staff ? 'Administrador' : 'Operario' },
    { label: 'Usuario', value: user?.username || 'N/A' },
    { label: 'Contraseña', value: '••••••••' },
  ];

  return (
    <div className="mt-6 grid md:grid-cols-2 gap-6">
      {userFields.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center p-4 bg-background-200 rounded-2xl shadow-sm border border-background-100"
        >
          <UserIcon className="h-5 w-5 text-primary-500 mr-3" />
          <div>
            <p className="text-sm text-text-secondary font-medium">{label}</p>
            <p className="text-lg text-text-primary font-semibold">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserInfoSection;
