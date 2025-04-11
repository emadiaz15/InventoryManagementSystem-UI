import React from "react";
import Modal from "../../../components/ui/Modal";

const ViewSubproductModal = ({ subproduct, isOpen, onClose }) => {
    if (!subproduct) return null;

    const defaultImages = ["/img/default-product-1.jpg"];
    const images = Array.isArray(subproduct.images) && subproduct.images.length > 0
        ? subproduct.images
        : defaultImages;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Subproducto"
            position="left"
            maxWidth="max-w-2xl"
        >
            <div className="flex flex-col h-full text-text-primary">
                <div className="space-y-2 flex-grow bg-background-100 p-2 rounded">
                    <p><span className="font-semibold">ID:</span> {subproduct.id}</p>
                    <p><span className="font-semibold">Código:</span> {subproduct.code || "N/A"}</p>
                    <p><span className="font-semibold">Nombre:</span> {subproduct.name || "SIN NOMBRE"}</p>
                    <p><span className="font-semibold">Descripción:</span> {subproduct.description || "SIN DESCRIPCIÓN"}</p>
                    <p><span className="font-semibold">Tipo:</span> {subproduct.typeName || "Sin tipo"}</p>
                    <p><span className="font-semibold">Categoría:</span> {subproduct.categoryName || "Sin categoría"}</p>
                    <p><span className="font-semibold">Producto padre:</span> {subproduct.parentName || "N/A"}</p>
                    <p><span className="font-semibold">Stock actual:</span> {subproduct.current_stock ?? 0}</p>
                    <p><span className="font-semibold">Estado:</span> {subproduct.status ? "Activo" : "Inactivo"}</p>
                    <p><span className="font-semibold">Creado en:</span> {subproduct.created_at || "N/A"}</p>
                    <p><span className="font-semibold">Modificado en:</span> {subproduct.modified_at || "N/A"}</p>
                    <p><span className="font-semibold">Eliminado en:</span> {subproduct.deleted_at || "N/A"}</p>
                    <p><span className="font-semibold">Creado por:</span> {subproduct.created_by || "N/A"}</p>
                    <p><span className="font-semibold">Modificado por:</span> {subproduct.modified_by || "N/A"}</p>
                    <p><span className="font-semibold">Eliminado por:</span> {subproduct.deleted_by || "N/A"}</p>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary-500 text-text-white rounded hover:bg-primary-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewSubproductModal;
