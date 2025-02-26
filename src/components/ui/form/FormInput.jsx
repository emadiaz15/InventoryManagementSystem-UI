import React from 'react';

const FormInput = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => (
  <div className="mb-4">
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
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full px-3 py-2 border border-background-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  </div>
);

export default FormInput;
