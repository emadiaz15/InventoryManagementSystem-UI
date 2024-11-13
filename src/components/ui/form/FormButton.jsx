// src/components/forms/FormButton.jsx
import React from 'react';

const FormButton = ({ children, type = "button", className = "", ...props }) => (
  <button
    type={type}
    className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default FormButton;
