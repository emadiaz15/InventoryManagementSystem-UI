import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-text-primary">{message}</h3>
            <div className="mt-4 flex justify-end space-x-4">
                <button
                    className="px-4 py-2 bg-warning-500 text-white rounded-lg hover:bg-warning-600 transition-colors"
                    onClick={onCancel}
                >
                    Cancelar
                </button>
                <button
                    className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors"
                    onClick={onConfirm}
                >
                    Confirmar
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmDialog;