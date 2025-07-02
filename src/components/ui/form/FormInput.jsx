import React, { forwardRef } from 'react';

const FormInput = forwardRef(({ 
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  error = "", // Puede ser string o array
}, ref) => {
  // Normaliza el error a string
  const renderError = () => {
    if (Array.isArray(error)) return error.join(', ');
    return error || "";
  };

  const hasError = Boolean(error && renderError());

  return (
    <div className="mb-4">
      {/* Etiqueta */}
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        ref={ref}
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${hasError ? "border-red-500" : "border-background-200"
          }`}
      />

      {/* Error */}
      {hasError && (
        <p className="mt-1 text-sm text-red-500">
          {renderError()}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
