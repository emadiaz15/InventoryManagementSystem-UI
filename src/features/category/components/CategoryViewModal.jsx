// src/features/category/components/CategoryViewModal.jsx
import React from "react";
import Modal from "@/components/ui/Modal";
import { formatArgentineDate } from "@/utils/dateUtils";

const CategoryViewModal = ({ isOpen, onClose, category }) => {
    if (!category) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Categoría">
            <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {category.id}</p>
                <p><strong>Nombre:</strong> {category.name}</p>
                <p>
                    <strong>Descripción:</strong>{" "}
                    {category.description || "Sin descripción"}
                </p>
                <p><strong>Estado:</strong> {category.status ? "Activo" : "Inactivo"}</p>
                <p><strong>Creado en:</strong> {formatArgentineDate(category.created_at)}</p>
                <p>
                    <strong>Modificado en:</strong>{" "}
                    {formatArgentineDate(category.modified_at)}
                </p>
                <p><strong>Creado por:</strong> {category.created_by}</p>
                <p>
                    <strong>Modificado por:</strong>{" "}
                    {category.modified_by || "N/A"}
                </p>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

export default CategoryViewModal;
