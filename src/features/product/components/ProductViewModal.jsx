import React from 'react';
import Modal from '../../../components/ui/Modal';

const ProductViewModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Producto">
            <div className="p-4 space-y-3">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Código:</strong> {product.code}</p>
                <p><strong>Nombre:</strong> {product.name || "SIN NOMBRE"}</p>
                <p><strong>Descripción:</strong> {product.description || "SIN DESCRIPCIÓN"}</p>

                {/* Usamos typeName y categoryName en lugar de los IDs */}
                <p><strong>Tipo:</strong> {product.typeName || "Sin tipo"}</p>
                <p><strong>Categoría:</strong> {product.categoryName || "Sin categoría"}</p>

                <p><strong>Estado:</strong> {product.status ? "Activo" : "Inactivo"}</p>
                <p><strong>Cantidad:</strong> {product.quantity}</p>
                {product.image ? (
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded" />
                ) : (
                    <p><strong>Imagen:</strong> No disponible</p>
                )}
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
