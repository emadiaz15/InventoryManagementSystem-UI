import React from "react";

const FormStockInput = ({
    label,
    name,
    value,
    onChange,
    required = false,
    placeholder = "",
    error = "",
}) => {
    // Nos aseguramos de que el valor a mostrar sea un string (si es arreglo, tomamos el primero)
    const displayValue = Array.isArray(value) ? value[0] : value || "";

    // Manejador de cambio que siempre recibe el objeto evento
    const handleChange = (e) => {
        // Verifica que e y e.target existan antes de destructurar
        if (e && e.target) {
            let newValue = e.target.value;
            if (Array.isArray(newValue)) {
                newValue = newValue[0];
            }
            // Llamar a onChange pasando un objeto similar a un evento
            onChange({ target: { name, value: newValue } });
        }
    };

    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
            )}
            <input
                id={name}
                type="number"
                name={name}
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className={`mt-1 block w-full px-3 py-2 border border-background-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormStockInput;
