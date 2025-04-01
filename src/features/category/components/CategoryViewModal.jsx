import React from "react";
import Modal from '../../../components/ui/Modal'; // Asegúrate de que la ruta sea correcta

const CategoryViewModal = ({ category, onClose }) => {
    if (!category) return null;

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalles de la Categoría">
            <div className="flex flex-col h-full"> {/* Contenedor principal con Flexbox */}
                <div className="space-y-2 flex-grow"> {/* Contenedor para el contenido principal */}
                    <p>
                        <strong>ID:</strong> {category.id}
                    </p>
                    <p>
                        <strong>Nombre:</strong> {category.name}
                    </p>
                    <p>
                        <strong>Descripción:</strong>{" "}
                        {category.description ? category.description : "Sin descripción"}
                    </p>
                    <p>
                        <strong>Estado:</strong> {category.status ? "Activo" : "Inactivo"}
                    </p>
                    <p>
                        <strong>Creado en:</strong> {category.created_at}
                    </p>
                    <p>
                        <strong>Modificado en:</strong>{" "}
                        {category.modified_at ? category.modified_at : "N/A"}
                    </p>
                    <p>
                        <strong>Eliminado en:</strong>{" "}
                        {category.deleted_at ? category.deleted_at : "N/A"}
                    </p>
                    <p>
                        <strong>Creado por:</strong> {category.created_by}
                    </p>
                    <p>
                        <strong>Modificado por:</strong>{" "}
                        {category.modified_by ? category.modified_by : "N/A"}
                    </p>
                    <p>
                        <strong>Eliminado por:</strong>{" "}
                        {category.deleted_by ? category.deleted_by : "N/A"}
                    </p>
                </div>
                <div className="flex justify-end mt-4"> {/* Contenedor para el botón "Cerrar" */}
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

export default CategoryViewModal;