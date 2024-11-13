import React from 'react';

const FormInput = ({ label, name, type = "text", value, onChange, required = false, placeholder = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
      required={required}
      placeholder={placeholder}
    />
  </div>
);

export default FormInput;
