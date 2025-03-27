import React from 'react';
import Modal from '../../../components/ui/Modal';

const UserViewModal = ({ user, isOpen, onClose }) => {
    if (!user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Datalles de Usuario">
            <div className="p-4 space-y-3">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Nombre de usuario:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nombre completo:</strong> {user.name} {user.last_name}</p>
                <p><strong>DNI:</strong> {user.dni}</p>
                <p><strong>Estado:</strong> {user.is_active ? "Active" : "Inactive"}</p>
                <p><strong>Administrador:</strong> {user.is_staff ? "Yes" : "No"}</p>
                {user.image ? (
                    <img src={user.image} alt={`${user.username} profile`} className="w-16 h-16 rounded-full" />
                ) : (
                    <p>Imagen no disponible</p>
                )}
                <button
                    onClick={onClose}
                    className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors w-full"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

export default UserViewModal;
