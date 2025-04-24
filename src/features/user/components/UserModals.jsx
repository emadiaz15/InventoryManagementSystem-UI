import React from 'react';

import UserRegisterModal from "./UserRegisterModal";
import UserEditModal from "./UserEditModal";
import UserModalView from "./UserModalView";
import DeleteMessage from "../../../components/common/DeleteMessage";
// Opcional si usas el modal de reset pass
import PasswordResetModal from './PasswordResetModal';

const UserModals = ({
    modalState,
    closeModal,
    // Handlers CRUD
    onregisterUser,
    onUpdateUser,
    onDeleteUser,
    onPasswordReset,
    handleActionSuccess,
    isProcessing,
    actionError,
}) => {

    if (!modalState || !modalState.type) return null;
    const currentUserData = modalState.userData;

    return (
        <>
            {modalState.type === "create" && (
                <UserRegisterModal
                    isOpen={true}
                    onClose={closeModal}
                    onCreate={onregisterUser}
                    onCreateSuccess={(msg) => handleActionSuccess(msg)}
                />
            )}

            {modalState.type === "edit" && currentUserData && (
                <UserEditModal
                    isOpen={true}
                    onClose={closeModal}
                    user={currentUserData}
                    onSave={onUpdateUser}
                    onSaveSuccess={handleActionSuccess}
                    onPasswordReset={onPasswordReset}
                />
            )}

            {modalState.type === "view" && currentUserData && (
                <UserModalView
                    isOpen={true}
                    onClose={closeModal}
                    user={currentUserData}
                />
            )}

            {modalState.type === "deleteConfirm" && currentUserData && (
                <DeleteMessage
                    isOpen={true}
                    onClose={closeModal}
                    onDelete={() => onDeleteUser(currentUserData)}
                    isDeleting={isProcessing}
                    deleteError={actionError?.message}
                    clearDeleteError={closeModal}
                    itemName="al usuario"
                    itemIdentifier={currentUserData.username || currentUserData.name}
                />
            )}
        </>
    );
};

export default UserModals;
