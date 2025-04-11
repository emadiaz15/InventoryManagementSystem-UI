import React, { useState } from "react";

const Filter = ({ columns, onFilterChange }) => {

    const [filters, setFilters] = useState(() =>
        columns.reduce((acc, col) => {
            acc[col.key] = col.defaultValue || "";
            return acc;
        }, {})
    );

    const handleInputChange = (key, value) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        if (onFilterChange) onFilterChange(updated);
    };

    return (
        <table id="filter-table" className="w-full mb-4">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="py-2 px-4 border-b border-background-200">
                            <span className="flex items-center text-text-primary">
                                {col.label}
                                <svg
                                    className="w-4 h-4 ms-1 text-primary-500"
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
                <tr>
                    {columns.map((col) => (
                        <th key={col.key + "-filter"} className="py-1 px-4 border-b border-background-200">
                            {col.filterable !== false && (

                                col.type === "select" ? (
                                    <select
                                        value={String(filters[col.key])}
                                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        {(col.options || []).map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder={`Filtrar ${col.label}`}
                                        value={String(filters[col.key])}
                                        onChange={(e) => handleInputChange(col.key, e.target.value)}
                                        className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                )
                            )}
                        </th>
                    ))}
                </tr>
            </thead>
        </table>
    );
};

export default Filter;
