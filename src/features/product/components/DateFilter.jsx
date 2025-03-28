import React, { useState } from 'react';

const DateFilter = ({ onFilterChange }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = start ? new Date(start) : null;
        const endDate = end ? new Date(end) : null;
        onFilterChange(startDate, endDate);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex space-x-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
                <input
                    type="date"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Fin</label>
                <input
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="flex items-end">
                <button
                    type="submit"
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                >
                    Filtrar
                </button>
            </div>
        </form>
    );
};

export default DateFilter;
