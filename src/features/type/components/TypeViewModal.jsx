import React from 'react';
import Modal from '../../../components/ui/Modal';

const TypeViewModal = ({ type, isOpen, onClose }) => {
    if (!type) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Tipo">
            <div className="p-4 space-y-3">
                <p><strong>ID:</strong> {type.id}</p>
                <p><strong>Nombre:</strong> {type.name || "SIN NOMBRE"}</p>
                <p><strong>Descripción:</strong> {type.description || "SIN DESCRIPCIÓN"}</p>
                <p><strong>Categoría (ID):</strong> {type.category || "SIN CATEGORÍA"}</p>
                <p><strong>Estado:</strong> {type.status ? "Activo" : "Inactivo"}</p>
                <p><strong>Creado en:</strong> {type.created_at || "N/A"}</p>
                <p><strong>Modificado en:</strong> {type.modified_at || "N/A"}</p>
                <p><strong>Eliminado en:</strong> {type.deleted_at || "N/A"}</p>
                <p><strong>Creado por:</strong> {type.created_by || "N/A"}</p>
                <p><strong>Modificado por:</strong> {type.modified_by || "N/A"}</p>
                <p><strong>Eliminado por:</strong> {type.deleted_by || "N/A"}</p>

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
