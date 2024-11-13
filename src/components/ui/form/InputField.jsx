// src/components/forms/InputField.jsx
import React from 'react';

const InputField = ({ label, type = "text", name, value, onChange, ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
      {...props}
    />
  </div>
);

export default InputField;
