// src/components/UserDropdown.jsx
import React, { useState, useEffect } from 'react';
import { getUserProfileLogged } from '../features/user/services/auth/getUserProfileLogged'; // Asegúrate de que este servicio existe y está configurado correctamente

const UserDropdown = () => {
  const [user, setUser] = useState({
    name: '',
    last_name: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getUserProfileLogged(); // Supongamos que esto devuelve el perfil del usuario logueado
        setUser({
          name: userProfile.name,
          last_name: userProfile.last_name,
        });
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="relative">
      <button className="dropdown-button font-mono text-white font-bold text-2xl">
        {user.name} {user.last_name}
      </button>
    </div>
  );
};

export default UserDropdown;
