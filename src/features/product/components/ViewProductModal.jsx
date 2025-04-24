import React from "react";
import Modal from "../../../components/ui/Modal";

const ViewProductModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;

    const defaultImages = ["/img/default-product-1.jpg"];
    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : defaultImages;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Producto"
            position="left"
            maxWidth="max-w-2xl"
        >
            <div className="flex flex-col h-full text-text-primary">
                <div className="space-y-2 flex-grow bg-background-100 p-2 rounded">
                    <p><span className="font-semibold">ID:</span> {product.id}</p>
                    <p><span className="font-semibold">Código:</span> {product.code || "N/A"}</p>
                    <p><span className="font-semibold">Nombre/Medida:</span> {product.name || "SIN NOMBRE"}</p>
                    <p><span className="font-semibold">Descripción:</span> {product.description || "SIN DESCRIPCIÓN"}</p>
                    <p><span className="font-semibold">Tipo:</span> {product.typeName || "Sin tipo"}</p>
                    <p><span className="font-semibold">Categoría:</span> {product.categoryName || "Sin categoría"}</p>
                    <p><span className="font-semibold">Estado:</span> {product.status ? "Activo" : "Inactivo"}</p>
                    <p><span className="font-semibold">Stock actual:</span> {product.current_stock ?? 0}</p>
                    <p><span className="font-semibold">Marca:</span> {product.brand || "N/A"}</p>
                    <p><span className="font-semibold">Ubicación:</span> {product.location || "N/A"}</p>
                    <p><span className="font-semibold">Creado en:</span> {product.created_at || "N/A"}</p>
                    <p><span className="font-semibold">Modificado en:</span> {product.modified_at || "N/A"}</p>
                    <p><span className="font-semibold">Creado por:</span> {product.created_by || "N/A"}</p>
                    <p><span className="font-semibold">Modificado por:</span> {product.modified_by || "N/A"}</p>
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

export default ViewProductModal;
