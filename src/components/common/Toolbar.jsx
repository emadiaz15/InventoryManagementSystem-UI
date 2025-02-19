import React from 'react';
import ActionButtonWithModal from '../ui/ActionButtonWithModal';

const Toolbar = ({ onSearch, buttonText = 'Nuevo', children, onSave }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <ActionButtonWithModal buttonText={buttonText} onSave={onSave}>
        {children}
      </ActionButtonWithModal>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 19l-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block pt-2 pl-10 text-sm text-text-primary border border-neutral-300 rounded-lg w-80 bg-background-100 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Buscar..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Toolbar;
