// src/features/category/components/CategoryModals.jsx
import React from "react";
import CategoryCreateModal from "./CategoryCreateModal";
import CategoryEditModal from "./CategoryEditModal";
import CategoryViewModal from "./CategoryViewModal";
import DeleteMessage from "@/components/common/DeleteMessage";

/**
 * Modales centralizados para categorías.
 * Ahora usan props desacoplados (sin modalState).
 */
const CategoryModals = ({
    showCreateModal,
    showEditModal,
    showViewModal,
    showConfirmDialog,
    category,
    categoryToDelete,
    onCreate,
    onUpdateCategory,
    onDelete,
    isProcessing,
    error,
    closeAllModals,
}) => {
    return (
        <>
            {showCreateModal && (
                <CategoryCreateModal
                    isOpen={showCreateModal}
                    onClose={closeAllModals}
                    onCreate={onCreate}
                    isProcessing={isProcessing}
                    error={error}
                />
            )}

            {showEditModal && category && (
                <CategoryEditModal
                    isOpen={showEditModal}
                    onClose={closeAllModals}
                    category={category}
                    onUpdateCategory={onUpdateCategory}
                    isProcessing={isProcessing}
                    error={error}
                />
            )}

            {showViewModal && category && (
                <CategoryViewModal
                    isOpen={showViewModal}
                    onClose={closeAllModals}
                    category={category}
                />
            )}

            {showConfirmDialog && categoryToDelete && (
                <DeleteMessage
                    isOpen={showConfirmDialog}
                    onClose={closeAllModals}
                    onDelete={onDelete}
                    isDeleting={isProcessing}
                    deleteError={error}
                    clearDeleteError={closeAllModals}
                    itemName="categoría"
                    itemIdentifier={categoryToDelete.name}
                />
            )}
        </>
    );
};

export default CategoryModals;
