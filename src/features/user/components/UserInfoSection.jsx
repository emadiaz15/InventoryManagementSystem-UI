import React, { useState } from 'react';
import UserInfoCard from './UserInfoCard';

const UserInfoSection = ({ user, setUser }) => {

  const handleUpdateUser = (updatedFields) => {
    setUser((prevUser) => ({ ...prevUser, ...updatedFields }));
  };
  
  return (
    <div className="mt-6 grid md:grid-cols-2 gap-4 text-secondary-500">
      {[
        { label: 'Correo Electrónico', value: user.email },
        { label: 'DNI', value: user.dni },
        { label: 'Activo', value: user.is_active ? 'Sí' : 'No' },
        { label: 'Administrador', value: user.is_staff ? 'Sí' : 'No' },
        { label: 'Usuario', value: user.username},
        { label: 'Contraseña', value: user.password}, // No mostrar la contraseña real
      ].map((info, index) => (
        <UserInfoCard
          key={index}
          label={info.label}
          value={info.value}
          userId={user.id}
          onUpdate={handleUpdateUser} // Actualiza el usuario después de una edición
        />
      ))}
    </div>
  );
};

export default UserInfoSection;
