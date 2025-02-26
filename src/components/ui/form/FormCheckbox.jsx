import React from 'react';

const FormCheckbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center mb-4">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="mr-2 h-4 w-4 rounded border border-background-200 text-primary-500 focus:ring-primary-500"
    />
    <label className="text-sm font-medium text-text-primary">{label}</label>
  </div>
);

export default FormCheckbox;
