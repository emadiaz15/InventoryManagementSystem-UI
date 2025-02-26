import React from 'react';

const Spinner = ({ size = '5', color = 'text-text-white' }) => {
  return (
    <svg
      className={`w-${size} h-${size} mx-auto animate-spin ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C3.58 0 0 3.58 0 8h4z"
      />
    </svg>
  );
};

export default Spinner;
