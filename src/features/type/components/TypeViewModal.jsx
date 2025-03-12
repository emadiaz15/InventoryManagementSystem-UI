import React from 'react';
import Modal from '../../../components/ui/Modal';

const TypeViewModal = ({ type, isOpen, onClose }) => {
    if (!type) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Tipo">
            <div className="p-4 space-y-3">
                <div>
                    <strong>Nombre:</strong> <span>{type.name || "SIN NOMBRE"}</span>
                </div>
                <div>
                    <strong>Descripción:</strong> <span>{type.description || "SIN DESCRIPCIÓN"}</span>
                </div>
                <div>
                    <strong>Categoría:</strong> <span>{type.categoryName || "SIN CATEGORÍA"}</span>
                </div>
                <button
                    onClick={onClose}
                    className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors w-full"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

export default TypeViewModal;
