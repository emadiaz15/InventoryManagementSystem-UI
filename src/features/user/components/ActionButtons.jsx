import React from 'react';

const ActionButtons = ({ onClose, loading }) => (
    <div className="flex justify-end space-x-2 mt-6">
        <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50"
        >
            Cancelar
        </button>
        <button
            type="submit"
            disabled={loading}
            className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {loading ? 'Guardando...' : 'Guardar'}
        </button>
    </div>
);

export default ActionButtons;
