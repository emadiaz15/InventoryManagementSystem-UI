import React, { useState, useEffect } from 'react';
import { getUserProfileLogged } from '../features/user/services/auth/getUserProfileLogged';

const UserDropdown = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userProfile = await getUserProfileLogged();
        setUser({ name: userProfile.name, last_name: userProfile.last_name });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <span className="text-white text-sm sm:text-base mr-2">Cargando...</span>;
  }

  return (
    <span className="text-white font-semibold text-sm sm:text-base mr-2">
      {user ? `${user.name} ${user.last_name}` : 'Usuario'}
    </span>
  );
};

export default UserDropdown;
