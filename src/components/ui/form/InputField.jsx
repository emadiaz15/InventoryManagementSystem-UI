import React from 'react';

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error = null,
  className = "",
  ...props
}) => (
  <div className={`mb-5 font-sans ${className}`}>
    {label && (
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-text-white mb-1"
      >
        {label}
      </label>
    )}

    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-md bg-background-100 text-text-primary placeholder-gray-500 shadow-sm border ${error
          ? "border-error-500 focus:ring-error-500"
          : "border-background-200 focus:ring-primary-500"
        } focus:ring-2 focus:outline-none transition-colors duration-200`}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />

    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-error-500">
        {error}
      </p>
    )}
  </div>
);

export default InputField;
