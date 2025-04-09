import React from 'react';

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  error = "",       // <-- Nuevo prop opcional para el mensaje de error
}) => {
  return (
    <div className="mb-4">
      {/* Etiqueta (label) */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      {/* Campo de entrada */}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border border-background-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${error ? "border-red-500" : ""
          }`}
      />

      {/* Texto de error (solo si error no es cadena vacía) */}
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
