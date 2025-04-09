import React from "react";
import CategoryCreateModal from "./CategoryCreateModal";
import CategoryEditModal from "./CategoryEditModal";
import CategoryViewModal from "./CategoryViewModal";
import DeleteMessage from "../../../components/common/DeleteMessage";

const CategoryModals = ({
    modalState,
    closeModal,
    handleUpdateCategory,
    handleDeleteCategory,
    isDeleting,
    deleteError,
    clearDeleteError,
    handleActionSuccess,
    fetchCategories,
}) => {
    const commonProps = {
        isOpen: modalState.type !== null && modalState.type !== "view",
        onClose: closeModal,
    };

    return (
        <>
            {modalState.type === "create" && (
                <CategoryCreateModal
                    isOpen={modalState.type === "create"}
                    onClose={closeModal}
                    onCreateSuccess={(message) => {
                        handleActionSuccess(message || "Categoría creada con éxito.");
                    }}
                />
            )}

            {modalState.type === "edit" && modalState.category && (
                <CategoryEditModal
                    {...commonProps}
                    category={modalState.category}
                    onSaveSuccess={(updatedData) =>
                        handleUpdateCategory(modalState.category.id, updatedData)
                    }
                />
            )}

            {modalState.type === "view" && modalState.category && (
                <CategoryViewModal {...commonProps} category={modalState.category} />
            )}

            {modalState.type === "deleteConfirm" && modalState.category && (
                <DeleteMessage
                    {...commonProps}
                    onDelete={() => handleDeleteCategory(modalState.category)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="la categoría"
                    itemIdentifier={modalState.category.name}
                />
            )}
        </>
    );
};

export default CategoryModals;