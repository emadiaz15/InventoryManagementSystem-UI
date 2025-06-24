import React, { useState } from 'react';

import UserRegisterModal from "./UserRegisterModal";
import UserEditModal from "./UserEditModal";
import UserModalView from "./UserModalView";
import DeleteMessage from "../../../components/common/DeleteMessage";
import PasswordResetModal from './PasswordResetModal';

const UserModals = ({
    modalState,
    closeModal,
    onRegisterUser,
    onUpdateUser,
    onDeleteUser,
    onPasswordReset,
    handleActionSuccess,
    isProcessing,
    actionError,
}) => {
    const [deleteConfirmState, setDeleteConfirmState] = useState(null);

    const currentUser = modalState?.userData;

    const handleOpenDeleteConfirmModal = ({ type, username, onConfirm }) => {
        setDeleteConfirmState({ type, username, onConfirm });
    };

    const handleCloseDeleteConfirm = () => setDeleteConfirmState(null);

    const handleConfirmDelete = async () => {
        if (deleteConfirmState?.onConfirm) {
            await deleteConfirmState.onConfirm();
        }
        handleCloseDeleteConfirm();
    };

    if (!modalState?.type) return null;

    return (
        <>
            {modalState.type === "create" && (
                <UserRegisterModal
                    isOpen
                    onClose={closeModal}
                    onCreate={onRegisterUser}
                    onCreateSuccess={handleActionSuccess}
                />
            )}

            {modalState.type === "edit" && currentUser && (
                <UserEditModal
                    isOpen
                    onClose={closeModal}
                    user={currentUser}
                    onSave={onUpdateUser}
                    onSaveSuccess={handleActionSuccess}
                    onPasswordReset={onPasswordReset}
                    openDeleteConfirmModal={handleOpenDeleteConfirmModal}
                />
            )}

            {modalState.type === "view" && currentUser && (
                <UserModalView
                    isOpen
                    onClose={closeModal}
                    user={currentUser}
                />
            )}

            {modalState.type === "deleteConfirm" && currentUser && (
                <DeleteMessage
                    isOpen
                    onClose={closeModal}
                    onDelete={() => onDeleteUser(currentUser)}
                    isDeleting={isProcessing}
                    deleteError={actionError?.message}
                    clearDeleteError={closeModal}
                    itemName="al usuario"
                    itemIdentifier={currentUser.username || currentUser.name}
                />
            )}

            {Boolean(deleteConfirmState) && (
                <DeleteMessage
                    isOpen
                    onClose={handleCloseDeleteConfirm}
                    onDelete={handleConfirmDelete}
                    itemName="la imagen de perfil"
                    itemIdentifier={deleteConfirmState.username}
                />
            )}
        </>
    );
};

export default UserModals;
