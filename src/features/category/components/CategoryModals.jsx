// src/features/category/components/CategoryModals.jsx
import React from "react";
import CategoryCreateModal from "./CategoryCreateModal";
import CategoryEditModal from "./CategoryEditModal";
import CategoryViewModal from "./CategoryViewModal";
import DeleteMessage from "../../../components/common/DeleteMessage";

const CategoryModals = ({
    modalState,
    closeModal,
    onCreate,
    onUpdateCategory,
    onDelete,
    isProcessing,
    actionError,
}) => {
    const common = { isOpen: modalState.type !== null, onClose: closeModal };

    return (
        <>
            {modalState.type === "create" && (
                <CategoryCreateModal
                    {...common}
                    onCreate={onCreate}
                    isProcessing={isProcessing}
                    error={actionError}
                />
            )}

            {modalState.type === "edit" && modalState.category && (
                <CategoryEditModal
                    {...common}
                    category={modalState.category}
                    onUpdateCategory={onUpdateCategory}
                    isProcessing={isProcessing}
                    error={actionError}
                />
            )}

            {modalState.type === "view" && modalState.category && (
                <CategoryViewModal
                    {...common}
                    category={modalState.category}
                />
            )}

            {modalState.type === "deleteConfirm" && modalState.category && (
                <DeleteMessage
                    {...common}
                    onDelete={() => onDelete(modalState.category)}
                    isDeleting={isProcessing}
                    deleteError={actionError}
                    clearDeleteError={closeModal}
                    itemName="categoría"
                    itemIdentifier={modalState.category.name}
                />
            )}
        </>
    );
};

export default CategoryModals;