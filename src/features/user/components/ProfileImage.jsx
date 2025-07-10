import React, { useState, useEffect, memo } from 'react';
import { UserIcon } from '@heroicons/react/20/solid';
import { downloadProfileImage } from '../services/downloadProfileImage';

/**
 * 📷 Componente para mostrar imagen de perfil o icono por defecto.
 *    Sólo se re-renderiza si cambia `image`.
 *
 * @param {string} image - URL de la imagen de perfil.
 */
const ProfileImage = ({ image }) => {
  const [errored, setErrored] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  // Cuando cambie la URL, reiniciamos el estado de error
  useEffect(() => {
    let isMounted = true;
    setErrored(false);

    const load = async () => {
      if (!image || typeof image !== 'string' || image.trim() === '') {
        setImgSrc(null);
        return;
      }
      try {
        const url = await downloadProfileImage(image);
        if (isMounted) setImgSrc(url);
      } catch (err) {
        console.warn('⚠️ Error cargando imagen de perfil:', err);
        if (isMounted) setErrored(true);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [image]);

  // Liberar objeto URL cuando cambie o se desmonte
  useEffect(() => {
    return () => {
      if (imgSrc) URL.revokeObjectURL(imgSrc);
    };
  }, [imgSrc]);

  const hasValidImage = typeof imgSrc === 'string' && imgSrc.trim() !== '' && !errored;

  return (
    <div className="flex items-center justify-center w-32 h-32 min-w-[8rem] min-h-[8rem] rounded-full border-2 border-background-100 shadow-sm sm:w-40 sm:h-40 sm:min-w-[10rem] sm:min-h-[10rem] mx-auto bg-white overflow-hidden">
      {hasValidImage ? (
        <img
          src={imgSrc}
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
