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
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none`}
      aria-describedby={error ? `${name}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
        {error}
      </p>
    )}
  </div>
);

export default InputField;
