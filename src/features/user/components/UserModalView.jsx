import React from 'react';
import Modal from '../../../components/ui/Modal';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const UserViewModal = ({ user, isOpen, onClose }) => {
    if (!isOpen || !user) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalles de Usuario" position="center">
            {/* Contenido del Modal */}
            <div className="p-4 space-y-4"> {/* Añadido más espacio vertical */}

                {/* --- Sección Imagen/Icono (NUEVO) --- */}
                <div className="flex justify-center mb-4">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={`${user.username || 'Usuario'} profile`}
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" // Tamaño y estilo
                        />
                    ) : (
                        // Icono por defecto si no hay imagen
                        <UserCircleIcon className="w-24 h-24 text-gray-400" />
                    )}
                </div>
                {/* --- Fin Sección Imagen/Icono --- */}


                {/* --- Detalles del Usuario (Ajustados) --- */}
                <div className="text-sm text-text-secondary space-y-2"> {/* Estilo consistente */}
                    <p><strong className="text-text-primary">ID:</strong> {user.id}</p>
                    <p><strong className="text-text-primary">Username:</strong> {user.username || 'N/A'}</p>
                    <p><strong className="text-text-primary">Email:</strong> {user.email || 'N/A'}</p>
                    <p><strong className="text-text-primary">Nombre completo:</strong> {`${user.name || ''} ${user.last_name || ''}`.trim() || 'N/A'}</p>
                    <p><strong className="text-text-primary">DNI:</strong> {user.dni || 'N/A'}</p>
                    <p><strong className="text-text-primary">Estado:</strong>
                        <span className={`ml-2 font-medium px-2 py-0.5 rounded-full text-xs ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                    </p>
                    <p><strong className="text-text-primary">Rol:</strong> {user.is_staff ? "Administrador" : "Operario"}</p>
                    {/* Mostrar fechas si existen */}
                    {user.created_at && <p><strong className="text-text-primary">Creado en:</strong> {new Date(user.created_at).toLocaleString()}</p>}
                    {user.modified_at && <p><strong className="text-text-primary">Modificado en:</strong> {new Date(user.modified_at).toLocaleString()}</p>}
                </div>
                {/* --- Fin Detalles --- */}


                {/* --- Botón Cerrar (Abajo) --- */}
                <div className="border-t border-neutral-200 pt-4 mt-6">
                    <button
                        onClick={onClose}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors w-full"
                    >
                        Cerrar
                    </button>
                </div>
                {/* --- Fin Botón --- */}
            </div>
            {/* Fin Contenido */}
        </Modal>
    );
};

export default UserViewModal;