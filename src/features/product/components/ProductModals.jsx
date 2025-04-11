import React from "react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import ViewProductModal from "./ViewProductModal";
import ProductCarouselOverlay from "./ProductCarouselOverlay";
import DeleteMessage from "../../../components/common/DeleteMessage";

/**
 * Centraliza la lógica de modales para Productos.
 *
 * @param {Object} modalState - { type: 'create'|'edit'|'view'|'deleteConfirm', productData: object|null }
 * @param {Function} closeModal - Cierra cualquier modal
 * @param {Function} onCreateProduct - Handler para crear producto
 * @param {Function} onUpdateProduct - Handler para actualizar producto
 * @param {Function} onDeleteProduct - Handler para eliminar producto
 * @param {Boolean} isDeleting - Estado de carga para la eliminación
 * @param {String|Null} deleteError - Error específico de la eliminación
 * @param {Function} clearDeleteError - Limpia el error de eliminación
 */
const ProductModals = ({
    modalState,
    closeModal,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,
    isDeleting,
    deleteError,
    clearDeleteError,
}) => {
    if (!modalState || !modalState.type) return null;

    const { type, productData, showCarousel = false } = modalState;

    return (
        <>
            {/* --- Modal Crear Producto --- */}
            {type === "create" && (
                <CreateProductModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={onCreateProduct}
                />
            )}

            {/* --- Modal Editar Producto --- */}
            {type === "edit" && productData && (
                <EditProductModal
                    isOpen={true}
                    onClose={closeModal}
                    product={productData}
                    onSave={onUpdateProduct}
                />
            )}

            {/* --- Modal Ver Producto + Carrusel --- */}
            {type === "view" && productData && (
                <>
                    <ViewProductModal
                        isOpen={true}
                        onClose={closeModal}
                        product={productData}
                    />
                    {showCarousel && (
                        <ProductCarouselOverlay
                            images={productData.images}
                            onClose={closeModal}
                        />
                    )}
                </>
            )}

            {/* --- Modal Confirmar Eliminación --- */}
            {type === "deleteConfirm" && productData && (
                <DeleteMessage
                    isOpen={true}
                    onClose={closeModal}
                    onDelete={() => onDeleteProduct(productData)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="el producto"
                    itemIdentifier={productData.name || "SIN NOMBRE"}
                />
            )}
        </>
    );
};

export default ProductModals;
