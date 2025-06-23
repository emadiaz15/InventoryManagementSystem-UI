import React from 'react';
import { UserIcon } from '@heroicons/react/20/solid';

const ProfileImage = ({ image }) => {
  const hasValidImage = typeof image === 'string' && image.trim() !== '';

  return (
    <div className="flex items-center justify-center w-32 h-32 min-w-[8rem] min-h-[8rem] rounded-full border-2 border-background-100 shadow-sm sm:w-40 sm:h-40 sm:min-w-[10rem] sm:min-h-[10rem] mx-auto bg-white overflow-hidden">
      {hasValidImage ? (
        <img
          key={image} // 🔁 Forzar re-render si la URL cambia
          src={image}
          alt="Imagen de perfil del usuario"
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
        />
      ) : (
        <UserIcon className="w-16 h-16 text-gray-400" aria-hidden="true" />
      )}
    </div>
  );
};

export default ProfileImage;
