import React from 'react';

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    loading = false,
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-text-secondary">
                {label}
            </label>
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value || ''} // Asegura que el valor nunca sea undefined
                    onChange={onChange}
                    required={required}
                    className="mt-1 block w-full border border-gray-300 bg-white text-text-primary rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 appearance-none"
                >
                    {loading ? (
                        <option disabled>Cargando...</option>
                    ) : (
                        options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))
                    )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-primary-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default FormSelect;
