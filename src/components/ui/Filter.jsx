import React, { useState } from "react";

const Filter = ({ columns, onFilterChange }) => {
    // Inicializa el estado de los filtros para cada columna.
    // Para "is_active" se fija "true" por defecto (filtrar usuarios activos)
    const [filters, setFilters] = useState(
        columns.reduce((acc, col) => {
            if (col.key === "is_active") {
                acc[col.key] = "true"; // Filtra usuarios activos por defecto
            } else {
                acc[col.key] = "";
            }
            return acc;
        }, {})
    );

    const handleInputChange = (key, value) => {
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        if (onFilterChange) {
            onFilterChange(updatedFilters);
        }
    };

    return (
        <table id="filter-table" className="w-full mb-4">
            <thead>
                {/* Primera fila: encabezados con etiquetas e icono de búsqueda */}
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="py-2 px-4 border-b border-background-200">
                            <span className="flex items-center text-text-primary">
                                {col.label}
                                <svg
                                    className="w-4 h-4 ms-1 text-primary-500"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                                    />
                                </svg>
                            </span>
                        </th>
                    ))}
                </tr>
                {/* Segunda fila: inputs de filtro */}
                <tr>
                    {columns.map((col) => (
                        <th key={`${col.key}-filter`} className="py-1 px-4 border-b border-background-200">
                            {col.filterable !== false && (
                                <>
                                    {col.key === "is_active" ? (
                                        <select
                                            value={filters[col.key]}
                                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    ) : col.key === "is_staff" ? (
                                        <select
                                            value={filters[col.key]}
                                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">-- Todos --</option>
                                            <option value="true">Administrador</option>
                                            <option value="false">Operario</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={`Filtrar ${col.label}`}
                                            value={filters[col.key]}
                                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    )}
                                </>
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
        </table>
    );
};

export default Filter;
