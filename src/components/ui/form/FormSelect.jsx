import React from 'react';

const FormSelect = ({ label, name, value, onChange, options = [], required = false, loading = false }) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-text-secondary">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
                <option value="">{loading ? "Cargando categorías..." : "Seleccione una categoría"}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;
