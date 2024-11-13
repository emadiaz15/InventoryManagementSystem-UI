import React from 'react';

const FormCheckbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center mb-4">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mr-2"
    />
    <label className="text-sm font-medium text-gray-700">{label}</label>
  </div>
);

export default FormCheckbox;
