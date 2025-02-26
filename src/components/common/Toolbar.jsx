// src/components/common/Toolbar.jsx
import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const Toolbar = ({ title, buttonText = 'Nuevo', onButtonClick }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold text-text-primary">{title}</h1>
      <button
        onClick={onButtonClick}
        type="button"
        className="flex items-center bg-primary-500 text-text-white py-2 px-4 rounded hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-500 transition-colors"
      >
        <span className="mr-2">{buttonText}</span>
        <PlusCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Toolbar;
