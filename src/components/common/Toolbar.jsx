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
      </div>
    </div>
  );
};

export default Toolbar;
