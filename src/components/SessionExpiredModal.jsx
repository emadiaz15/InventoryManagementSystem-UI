import React from 'react';

const SessionExpiredModal = ({ isOpen, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Sesión expirada
                </h2>
                <p className="text-gray-600 mb-6">
                    Tu sesión ha expirado. ¿Deseas iniciar sesión nuevamente?
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onConfirm}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded transition-colors"
                    >
                        Ir al Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
