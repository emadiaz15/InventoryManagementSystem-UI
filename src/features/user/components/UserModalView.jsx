import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Spinner from '../../../components/ui/Spinner';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { fetchProtectedImage } from '../../../services/imageService';

const UserViewModal = ({ user, isOpen, onClose }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageStatus, setImageStatus] = useState('loading');

    useEffect(() => {
        if (!user?.image_url || !isOpen) return;

        setImageStatus('loading');
        setImageUrl(null);

        fetchProtectedImage(user.image_url)
            .then((blobUrl) => {
                setImageUrl(blobUrl);
                setImageStatus('loaded');
            })
            .catch(() => setImageStatus('error'));
    }, [user?.image_url, isOpen]);

    if (!isOpen || !user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Usuario">
            <div className="flex flex-col h-full">
                <div className="flex justify-center mb-4">
                    {imageStatus === 'loading' && (
                        <div className="w-32 h-32 flex items-center justify-center">
                            <Spinner size="6" color="text-gray-500" />
                        </div>
                    )}
                    {imageStatus === 'loaded' && imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Imagen de perfil"
                            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                            onClick={() => window.open(imageUrl, '_blank')}
                        />
                    )}
                    {imageStatus === 'error' && (
                        <UserCircleIcon className="w-32 h-32 text-gray-400" />
                    )}
                </div>
                <div className="space-y-2 flex-grow text-sm text-text-secondary">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Username:</strong> {user.username || "N/A"}</p>
                    <p><strong>Email:</strong> {user.email || "N/A"}</p>
                    <p><strong>Nombre completo:</strong> {`${user.name || ''} ${user.last_name || ''}`.trim() || "N/A"}</p>
                    <p><strong>DNI:</strong> {user.dni || "N/A"}</p>
                    <p><strong>Estado:</strong> {user.is_active ? "Activo" : "Inactivo"}</p>
                    <p><strong>Rol:</strong> {user.is_staff ? "Administrador" : "Operario"}</p>
                    <p><strong>Creado en:</strong> {user.created_at ? new Date(user.created_at).toLocaleString() : "N/A"}</p>
                    <p><strong>Modificado en:</strong> {user.modified_at ? new Date(user.modified_at).toLocaleString() : "N/A"}</p>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default UserViewModal;
