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
    createStatus,
    updateStatus,
    deleteStatus,
    actionError,
}) => {
    const { type, category } = modalState;
    const common = { isOpen: type !== null, onClose: closeModal };

    return (
        <>
            {type === "create" && (
                <CategoryCreateModal
                    {...common}
                    onCreate={onCreate}
                    isProcessing={createStatus === "loading"}
                    error={actionError}
                />
            )}

            {type === "edit" && category && (
                <CategoryEditModal
                    {...common}
                    category={category}
                    onUpdateCategory={onUpdateCategory}
                    isProcessing={updateStatus === "loading"}
                    error={actionError}
                />
            )}

            {type === "view" && category && (
                <CategoryViewModal
                    {...common}
                    category={category}
                />
            )}

            {type === "deleteConfirm" && category && (
                <DeleteMessage
                    {...common}
                    onDelete={() => onDelete(category)}
                    isDeleting={deleteStatus === "loading"}
                    deleteError={actionError}
                    clearDeleteError={closeModal}
                    itemName="categoría"
                    itemIdentifier={category.name}
                />
            )}
        </>
    );
};

export default CategoryModals;
