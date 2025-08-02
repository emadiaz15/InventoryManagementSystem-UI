import React from "react"
import Modal from "@/components/ui/Modal"

const formatDate = (s) =>
    s ? new Date(s).toLocaleString() : "N/A"

const TypeViewModal = ({ type, isOpen, onClose, getCategoryName }) => {
    if (!isOpen || !type) return null

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Tipo">
            <div className="space-y-2 text-sm text-gray-800">
                <p><strong>ID:</strong> {type.id}</p>
                <p><strong>Nombre:</strong> {type.name}</p>
                <p><strong>Descripción:</strong> {type.description || "Sin descripción"}</p>
                <p><strong>Categoría:</strong> {getCategoryName(type.category)}</p>
                <p><strong>Estado:</strong> {type.status ? "Activo" : "Inactivo"}</p>
                <p><strong>Creado en:</strong> {formatDate(type.created_at)}</p>
                <p><strong>Modificado en:</strong> {formatDate(type.modified_at)}</p>
                <p><strong>Creado por:</strong> {type.created_by}</p>
                <p><strong>Modificado por:</strong> {type.modified_by || "N/A"}</p>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    aria-label="Cerrar detalles del tipo"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    )
}

export default TypeViewModal
