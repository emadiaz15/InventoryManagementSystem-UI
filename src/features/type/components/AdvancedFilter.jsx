//* src/features/product/components/AdvancedFilter */

import React, { useState } from "react";

const AdvancedFilter = ({ columns, initialFilters = {}, onFilterChange }) => {
    const [filters, setFilters] = useState(() => ({
        ...columns.reduce((acc, col) => {
            acc[col.key] = initialFilters[col.key] ?? "";
            return acc;
        }, {})
    }));

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const column = columns.find((col) => col.key === name);

        let realValue = value;

        if (column?.filterType === "select" && column.options?.length) {
            const matched = column.options.find((opt) => opt.label === value);
            if (matched) realValue = matched.value; // usar el id correspondiente
        }

        const updated = { ...filters, [name]: realValue };
        setFilters(updated);
        if (onFilterChange) onFilterChange(updated);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {columns.map((col) => {
                if (col.filterable === false) return null;

                return (
                    <div key={col.key} className="mb-4">
                        <label htmlFor={col.key} className="block text-sm font-medium text-text-secondary">
                            {col.label}
                        </label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
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
                            </div>
                            <input
                                type="text"
                                name={col.key}
                                id={col.key}
                                list={col.filterType === "select" ? `${col.key}-options` : undefined}
                                placeholder={`Filtrar ${col.label}`}
                                value={filters[col.key]}
                                onChange={handleInputChange}
                                className="pl-9 block w-full border border-gray-300 bg-white text-text-primary rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            />
                            {col.filterType === "select" && (
                                <datalist id={`${col.key}-options`}>
                                    {(col.options || []).map((opt) => (
                                        <option key={opt.value} value={opt.label} />
                                    ))}
                                </datalist>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AdvancedFilter;
