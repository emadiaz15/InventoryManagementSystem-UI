// src/components/ui/Modal.jsx
import React, { useEffect, useRef } from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'center',
  maxWidth = 'max-w-xl',
  className = '',
}) => {
  const modalRef = useRef(null);
  const modalId = useRef(`modal-${Math.random().toString(36).substr(2, 9)}`);
  const titleId = `${modalId.current}-title`;
  const contentId = `${modalId.current}-content`;

  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

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

  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-10',
    bottom: 'items-end justify-center pb-10',
    left: 'items-center justify-start pl-10',
    right: 'items-center justify-end pr-10',
  };

  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 z-[9999] flex p-4 bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out ${positionClasses[position]}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={contentId}
      tabIndex={-1}
      ref={modalRef}
    >
      <div
        className={`bg-background-100 p-6 rounded-lg shadow-xl w-full ${maxWidth} relative max-h-[90vh] overflow-y-auto flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          {title && (
            <h2 id={titleId} className="text-xl md:text-2xl font-semibold text-text-primary">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 rounded-full p-1 ml-auto"
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido */}
        <div id={contentId} className="text-text-primary overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
