import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, position = 'center' }) => {
  const modalRef = useRef(null);
  const titleId = `modal-title-${React.useId()}`; // Genera ID único para accesibilidad
  const contentId = `modal-content-${React.useId()}`;

  // Efecto para enfocar el modal al abrirse (mejora accesibilidad)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Pequeño delay para asegurar que la transición (si la hay) termine
      setTimeout(() => {
        modalRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Efecto para manejar el cierre con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  // Clases para ubicar el modal
  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-10', // Ajustado para top
    bottom: 'items-end justify-center pb-10', // Ajustado para bottom
    // Left/Right son menos comunes para modales centrados, pero se mantienen si los necesitas
    left: 'items-center justify-start pl-10',
    right: 'items-center justify-end pr-10',
  };

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-[9999] flex p-4 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out ${positionClasses[position]}`}
      onClick={(e) => e.target.id === 'modal-overlay' && onClose()}
      role="dialog" // Rol ARIA
      aria-modal="true" // Indica que es modal
      aria-labelledby={title ? titleId : undefined} // Vincula título
      aria-describedby={contentId} // Vincula contenido
      tabIndex={-1} // Permite enfocar el div del overlay si es necesario
      ref={modalRef} // Referencia para enfocar
    >
      {/* Contenedor del contenido del modal */}
      <div
        className="bg-background-100 p-6 rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto relative max-h-[90vh] overflow-y-auto flex flex-col"
        // Evita que el click dentro del modal cierre el overlay
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado con Título y Botón de Cierre */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          {title && (
            <h2 id={titleId} className="text-xl md:text-2xl font-semibold text-text-primary">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 rounded-full p-1 ml-auto" // Estilo mejorado para foco
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido Principal */}
        <div id={contentId} className="text-text-primary overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;