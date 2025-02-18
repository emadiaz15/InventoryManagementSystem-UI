// components/ProfileImage.jsx
import React from 'react';
import { UserIcon } from '@heroicons/react/20/solid';

const ProfileImage = ({ image }) => {
  return (
    <>
      {image ? (
        <img
          src={image}
          alt="Foto de perfil"
          className="w-32 h-32 mx-auto rounded-full border-4 border-primary-500"
        />
      ) : (
        <UserIcon className="w-32 h-32 mx-auto text-gray-400 border-4 border-primary-500 rounded-full p-2" />
      )}
    </>
  );
};

export default ProfileImage;
