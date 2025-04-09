import React from "react";
import TypeCreateModal from "./TypeCreateModal";
import TypeEditModal from "./TypeEditModal";
import TypeViewModal from "./TypeViewModal";
import DeleteMessage from "../../../components/common/DeleteMessage";

const TypeModals = ({
    modalState,         // Estado del modal desde TypeList { type: 'create'|'edit'|'view'|'deleteConfirm', typeData: object|null }
    closeModal,         // Función para cerrar cualquier modal, desde TypeList
    // Handlers CRUD desde TypeList
    onCreateType,
    onUpdateType,
    onDeleteType,
    // Props para DeleteMessage
    isDeleting,
    deleteError,
    clearDeleteError,
    // Datos necesarios para los modales de formulario/vista
    categories,
    loadingCategories,
    getCategoryName, // Para TypeViewModal si necesita mostrar nombre

}) => {

    if (!modalState || !modalState.type) return null; // No renderizar si no hay modal activo

    return (
        <>
            {/* --- Modal de Creación --- */}
            {modalState.type === "create" && (
                <TypeCreateModal
                    isOpen={true}
                    onClose={closeModal}
                    // Pasa el handler de creación de TypeList. El modal interno llamará a este
                    // después de validar y preparar los datos.
                    onCreate={onCreateType}
                    categories={categories} // Pasa las categorías para el selector
                    loadingCategories={loadingCategories}
                />
            )}

            {/* --- Modal de Edición --- */}
            {modalState.type === "edit" && modalState.typeData && (
                <TypeEditModal
                    isOpen={true}
                    onClose={closeModal}
                    type={modalState.typeData} // Los datos actuales del tipo a editar
                    // Pasa el handler de actualización de TypeList. El modal interno llamará a este.
                    onSave={onUpdateType}
                    categories={categories} // Pasa las categorías para el selector
                    loadingCategories={loadingCategories}
                />
            )}

            {/* --- Modal de Vista --- */}
            {modalState.type === "view" && modalState.typeData && (
                <TypeViewModal
                    isOpen={true}
                    onClose={closeModal}
                    type={modalState.typeData} // Los datos del tipo a visualizar
                    getCategoryName={getCategoryName} // Pasa la función si es necesaria en este modal
                />
            )}

            {/* --- Modal de Confirmación de Eliminación --- */}
            {modalState.type === "deleteConfirm" && modalState.typeData && (
                <DeleteMessage
                    isOpen={true} // Siempre abierto si modalState.type es 'deleteConfirm'
                    onClose={closeModal}
                    onDelete={() => onDeleteType(modalState.typeData)} // Llama al handler de eliminación de TypeList
                    isDeleting={isDeleting} // Estado de carga de eliminación
                    deleteError={deleteError} // Error específico de eliminación
                    clearDeleteError={clearDeleteError} // Para limpiar el error
                    itemName="el tipo" // Texto personalizable
                    itemIdentifier={modalState.typeData.name} // Identificador del item
                />
            )}
        </>
    );
};

export default TypeModals;