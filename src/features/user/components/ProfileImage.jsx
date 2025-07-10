import React, { useState, useEffect, memo } from 'react';
import { UserIcon } from '@heroicons/react/20/solid';

/**
 * 📷 Componente para mostrar imagen de perfil o icono por defecto.
 *    Sólo se re-renderiza si cambia `image`.
 *
 * @param {string} image - URL de la imagen de perfil.
 */
const ProfileImage = ({ image }) => {
  const [errored, setErrored] = useState(false);

  // Cuando cambie la URL, reiniciamos el estado de error
  useEffect(() => {
    setErrored(false);
  }, [image]);

  const hasValidImage = typeof image === 'string' && image.trim() !== '' && !errored;

  return (
    <div className="flex items-center justify-center w-32 h-32 min-w-[8rem] min-h-[8rem] rounded-full border-2 border-background-100 shadow-sm sm:w-40 sm:h-40 sm:min-w-[10rem] sm:min-h-[10rem] mx-auto bg-white overflow-hidden">
      {hasValidImage ? (
        <img
          src={image}
          alt="Imagen de perfil del usuario"
          className="w-full h-full object-cover rounded-full"
          crossOrigin="anonymous"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <UserIcon className="w-16 h-16 text-gray-400" aria-hidden="true" />
      )}
    </div>
  );
};

// Memoizamos para evitar renders innecesarios
export default memo(ProfileImage);
