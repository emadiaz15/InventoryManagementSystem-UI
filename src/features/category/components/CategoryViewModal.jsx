import React from "react";

const CategoryViewModal = ({ category, onClose }) => {
    if (!category) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">Detalles de la Categoría</h2>
                <div className="space-y-2">
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
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryViewModal;
