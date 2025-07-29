import React from "react"
import TypeCreateModal from "./TypeCreateModal"
import TypeEditModal from "./TypeEditModal"
import TypeViewModal from "./TypeViewModal"
import DeleteMessage from "@/components/common/DeleteMessage"

const TypeModals = ({
    showCreateModal,
    showEditModal,
    showViewModal,
    showConfirmDialog,
    type,
    typeToDelete,
    onCreateType,
    onUpdateType,
    onDeleteType,
    categories,
    loadingCategories,
    getCategoryName,
    closeAllModals,
    error
}) => {
    return (
        <>
            {showCreateModal && (
                <TypeCreateModal
                    isOpen
                    onClose={closeAllModals}
                    onCreateType={onCreateType}
                    categories={categories}
                    loadingCategories={loadingCategories}
                />
            )}

            {showEditModal && type && (
                <TypeEditModal
                    isOpen
                    onClose={closeAllModals}
                    type={type}
                    onUpdateType={onUpdateType}
                    categories={categories}
                    loadingCategories={loadingCategories}
                />
            )}

            {showViewModal && type && (
                <TypeViewModal
                    isOpen
                    onClose={closeAllModals}
                    type={type}
                    getCategoryName={getCategoryName}
                />
            )}

            {showConfirmDialog && typeToDelete && (
                <DeleteMessage
                    isOpen
                    onClose={closeAllModals}
                    onDelete={() => onDeleteType(typeToDelete)}
                    deleteError={error}
                    clearDeleteError={closeAllModals}
                    itemName="el tipo"
                    itemIdentifier={typeToDelete.name}
                />
            )}
        </>
    )
}

export default TypeModals
