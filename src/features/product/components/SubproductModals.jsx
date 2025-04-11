import React from "react";
import CreateSubproductModal from "./CreateSubproductModal";
import EditSubproductModal from "./EditSubproductModal";
import ViewSubproductModal from "./ViewSubproductModal";
import DeleteMessage from "../../../components/common/DeleteMessage";

/**
 * Centraliza la lógica de modales para Subproductos.
 *
 * @param {Object} modalState - { type: 'create'|'edit'|'view'|'deleteConfirm', subproductData: object|null }
 * @param {Function} closeModal - Cierra cualquier modal
 * @param {Function} onCreateSubproduct - Handler para crear subproducto
 * @param {Function} onUpdateSubproduct - Handler para actualizar subproducto
 * @param {Function} onDeleteSubproduct - Handler para eliminar subproducto
 * @param {Boolean} isDeleting - Estado de carga para la eliminación
 * @param {String|Null} deleteError - Error específico de la eliminación
 * @param {Function} clearDeleteError - Limpia el error de eliminación
 * @param {Object|null} parentProduct - Producto padre (requerido para crear subproducto)
 */
const SubproductModals = ({
    modalState,
    closeModal,
    onCreateSubproduct,
    onUpdateSubproduct,
    onDeleteSubproduct,
    isDeleting,
    deleteError,
    clearDeleteError,
    parentProduct = null,
}) => {
    if (!modalState || !modalState.type) return null;

    const { type, subproductData } = modalState;

    return (
        <>
            {/* --- Modal Crear Subproducto --- */}
            {type === "create" && parentProduct && (
                <CreateSubproductModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={onCreateSubproduct}
                    product={parentProduct}
                />
            )}

            {/* --- Modal Editar Subproducto --- */}
            {type === "edit" && subproductData && (
                <EditSubproductModal
                    isOpen={true}
                    onClose={closeModal}
                    subproduct={subproductData}
                    onSave={onUpdateSubproduct}
                />
            )}

            {/* --- Modal Ver Subproducto --- */}
            {type === "view" && subproductData && (
                <ViewSubproductModal
                    isOpen={true}
                    onClose={closeModal}
                    subproduct={subproductData}
                />
            )}

            {/* --- Modal Confirmar Eliminación --- */}
            {type === "deleteConfirm" && subproductData && (
                <DeleteMessage
                    isOpen={true}
                    onClose={closeModal}
                    onDelete={() => onDeleteSubproduct(subproductData)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="el subproducto"
                    itemIdentifier={subproductData.name || "SIN NOMBRE"}
                />
            )}
        </>
    );
};

export default SubproductModals;
