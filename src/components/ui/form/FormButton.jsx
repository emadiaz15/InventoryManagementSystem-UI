import React from 'react';

const FormButton = ({ children, type = "button", className = "", ...props }) => (
  <button
    type={type}
    className={`bg-primary-500 text-text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default FormButton;
