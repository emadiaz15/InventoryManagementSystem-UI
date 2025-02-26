// src/components/common/FilterTable.jsx
import React, { useState } from "react";

const FilterTable = ({ columns, onFilterChange }) => {
    // Initialize filter state for each column key.
    const [filters, setFilters] = useState(
        columns.reduce((acc, col) => {
            if (col.key === "is_active") {
                acc[col.key] = "Activo"; // Default to "Activo" for estado.
            } else if (col.key === "is_staff") {
                acc[col.key] = ""; // Default blank for administrador.
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
                {/* Header row with labels and sort icons */}
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="py-2 px-4 border-b border-gray-200">
                            <span className="flex items-center">
                                {col.label}
                                <svg
                                    className="w-4 h-4 ms-1"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m8 15 4 4 4-4m0-6-4-4-4 4"
                                    />
                                </svg>
                            </span>
                        </th>
                    ))}
                </tr>
                {/* Second header row with filter inputs */}
                <tr>
                    {columns.map((col) => (
                        <th key={`${col.key}-filter`} className="py-1 px-4 border-b border-gray-200">
                            {col.filterable !== false && (
                                <>
                                    {col.key === "is_active" ? (
                                        <select
                                            value={filters[col.key]}
                                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    ) : col.key === "is_staff" ? (
                                        <select
                                            value={filters[col.key]}
                                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        >
                                            <option value="">-- Todos --</option>
                                            <option value="Sí">Sí</option>
                                            <option value="No">No</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            placeholder={`Filter ${col.label}`}
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

export default FilterTable;
