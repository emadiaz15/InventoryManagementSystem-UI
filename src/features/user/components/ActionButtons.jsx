import React from 'react';

const ActionButtons = ({ onClose, loading }) => (
    <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">
            Cancelar
        </button>
        <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600  text-white py-2 px-4 rounded"
            disabled={loading}
        >
            {loading ? 'Guardando...' : 'Guardar'}
        </button>
    </div>
);

export default ActionButtons;