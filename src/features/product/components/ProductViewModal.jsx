import React from "react";
import Modal from "../../../components/ui/Modal";

const ProductViewModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;

    // Imágenes por defecto si el producto no tiene
    const defaultImages = ["/product-images.jpg", "/product-images1.jpg"];

    // Verificamos si hay imágenes válidas en el producto
    const images = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : defaultImages;

    console.log("🖼️ Imágenes del producto:", images); // para verificar

    const modalWidthClass = "md:max-w-2xl";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Producto"
            className={`${modalWidthClass} max-h-screen overflow-y-auto`}
        >
            <div className="p-4 space-y-3">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Código:</strong> {product.code}</p>
                <p><strong>Nombre:</strong> {product.name || "SIN NOMBRE"}</p>
                <p><strong>Descripción:</strong> {product.description || "SIN DESCRIPCIÓN"}</p>
                <p><strong>Tipo:</strong> {product.typeName || "Sin tipo"}</p>
                <p><strong>Categoría:</strong> {product.categoryName || "Sin categoría"}</p>
                <p><strong>Estado:</strong> {product.status ? "Activo" : "Inactivo"}</p>
                <p><strong>Cantidad:</strong> {product.quantity}</p>
                <p><strong>Imagen:</strong> {images === defaultImages ? "Imágenes por defecto" : "Imágenes cargadas"}</p>
                <p><strong>Creado en:</strong> {product.created_at}</p>
                <p><strong>Modificado en:</strong> {product.modified_at || "N/A"}</p>
                <p><strong>Eliminado en:</strong> {product.deleted_at || "N/A"}</p>
                <p><strong>Creado por:</strong> {product.created_by}</p>
                <p><strong>Modificado por:</strong> {product.modified_by || "N/A"}</p>
                <p><strong>Eliminado por:</strong> {product.deleted_by || "N/A"}</p>
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

export default ProductViewModal;
