import React from "react";
import Modal from "../../../components/ui/Modal";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString(); // Puedes usar dayjs o date-fns si quieres más control
};

const CategoryViewModal = ({ category, onClose }) => {
    if (!category) return null;

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalles de la Categoría">
            <div className="flex flex-col h-full">
                <dl className="space-y-2 flex-grow text-text-primary">
                    <div>
                        <dt className="font-semibold">ID:</dt>
                        <dd>{category.id}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Nombre:</dt>
                        <dd>{category.name}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Descripción:</dt>
                        <dd>{category.description || "Sin descripción"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Estado:</dt>
                        <dd>{category.status ? "Activo" : "Inactivo"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Creado en:</dt>
                        <dd>{formatDate(category.created_at)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Modificado en:</dt>
                        <dd>{formatDate(category.modified_at)}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Creado por:</dt>
                        <dd>{category.created_by || "N/A"}</dd>
                    </div>
                    <div>
                        <dt className="font-semibold">Modificado por:</dt>
                        <dd>{category.modified_by || "N/A"}</dd>
                    </div>
                </dl>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        aria-label="Cerrar modal"
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
