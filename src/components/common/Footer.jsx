import React from 'react';

const Footer = () => {
  return (
    <footer
      className="
        bg-primary-500 
        text-white 
        py-0.5 px-4
        leading-tight
        w-screen          /* ancho = viewport width */
        /* fixed bottom-0 left-0  Si lo quieres siempre visible pegado al bottom */
      "
    >
      <div className="w-full text-center text-sm sm:text-base">
        <p>
          &copy; 2025 Mi Aplicación. Todos los derechos reservados. Desarrollado por Emanuel Diaz.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
