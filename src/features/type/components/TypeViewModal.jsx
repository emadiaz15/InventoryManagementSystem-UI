import React from 'react';
import Modal from '../../../components/ui/Modal';

const TypeViewModal = ({ type, isOpen, onClose }) => {
    if (!type) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Tipo">
            <div className="flex flex-col h-full">
                <div className="space-y-2 flex-grow">
                    <p>
                        <strong>ID:</strong> {type.id}
                    </p>
                    <p>
                        <strong>Nombre:</strong> {type.name || "SIN NOMBRE"}
                    </p>
                    <p>
                        <strong>Descripción:</strong> {type.description || "SIN DESCRIPCIÓN"}
                    </p>
                    <p>
                        <strong>Categoría (ID):</strong> {type.category || "SIN CATEGORÍA"}
                    </p>
                    <p>
                        <strong>Estado:</strong> {type.status ? "Activo" : "Inactivo"}
                    </p>
                    <p>
                        <strong>Creado en:</strong> {type.created_at || "N/A"}
                    </p>
                    <p>
                        <strong>Modificado en:</strong> {type.modified_at || "N/A"}
                    </p>
                    <p>
                        <strong>Eliminado en:</strong> {type.deleted_at || "N/A"}
                    </p>
                    <p>
                        <strong>Creado por:</strong> {type.created_by || "N/A"}
                    </p>
                    <p>
                        <strong>Modificado por:</strong> {type.modified_by || "N/A"}
                    </p>
                    <p>
                        <strong>Eliminado por:</strong> {type.deleted_by || "N/A"}
                    </p>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TypeViewModal;