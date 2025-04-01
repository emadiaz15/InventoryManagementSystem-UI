import React from 'react';
import Modal from '../ui/Modal';
import ErrorMessage from './ErrorMessage';
import Spinner from '../ui/Spinner';

const DeleteMessage = ({
    isOpen,
    onClose,
    onDelete,
    isDeleting,
    deleteError,
    clearDeleteError,
    itemName,
    itemIdentifier,
}) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación" position="center">
            {deleteError && (
                <div className="mb-4">
                    <ErrorMessage message={deleteError} onClose={clearDeleteError} />
                </div>
            )}

            <p className="text-text-secondary mb-6">
                ¿Estás seguro de que deseas eliminar (desactivar) {itemName}
                <strong className="text-text-primary"> "{itemIdentifier}"</strong>?
            </p>
            <div className="flex justify-end space-x-3">
                <button onClick={onClose} disabled={isDeleting} className="bg-neutral-500 text-text-white px-4 py-2 rounded hover:bg-neutral-600 transition-colors"> Cancelar </button>
                <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="bg-error-500 text-text-white px-4 py-2 rounded hover:bg-error-600 transition-colors"
                >
                    {isDeleting ? <><Spinner size="sm" /> Eliminando...</> : 'Confirmar Eliminación'}
                </button>
            </div>
        </Modal>
    );
};

export default DeleteMessage;