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
  <div className={`mb-4 ${className}`}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-text-primary">
        {label}
      </label>
    )}
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full px-3 py-2 border ${error ? "border-error-500" : "border-background-200"
        } rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none`}
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
