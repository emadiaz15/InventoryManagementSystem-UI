// src/features/type/components/TypeModals.jsx
import React from "react"
import TypeCreateModal from "./TypeCreateModal"
import TypeEditModal from "./TypeEditModal"
import TypeViewModal from "./TypeViewModal"
import DeleteMessage from "@/components/common/DeleteMessage"

const TypeModals = ({
    modalState,
    closeModal,
    onCreateType,
    onUpdateType,
    onDeleteType,
    categories,
    loadingCategories,
    getCategoryName
}) => {
    const { type, typeData } = modalState

    return (
        <>
            {type === "create" && (
                <TypeCreateModal
                    isOpen
                    onClose={closeModal}
                    onCreateType={onCreateType}
                    categories={categories}
                    loadingCategories={loadingCategories}
                />
            )}
            {type === "edit" && typeData && (
                <TypeEditModal
                    isOpen
                    onClose={closeModal}
                    type={typeData}
                    onUpdateType={onUpdateType}
                    categories={categories}
                    loadingCategories={loadingCategories}
                />
            )}
            {type === "view" && typeData && (
                <TypeViewModal
                    isOpen
                    onClose={closeModal}
                    type={typeData}
                    getCategoryName={getCategoryName}
                />
            )}
            {type === "deleteConfirm" && typeData && (
                <DeleteMessage
                    isOpen
                    onClose={closeModal}
                    onDelete={() => onDeleteType(typeData)}
                    itemName="el tipo"
                    itemIdentifier={typeData.name}
                />
            )}
        </>
    )
}

export default TypeModals
