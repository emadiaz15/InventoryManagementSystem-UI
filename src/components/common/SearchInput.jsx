import React from 'react';

const SearchInput = ({ placeholder, onSearch }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
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
        className="block pt-2 pl-10 text-sm text-text-primary border border-primary-500 rounded-lg w-80 bg-background-100 focus:ring-primary-600 focus:border-primary-600"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Buscar"
      />
    </div>
  );
};

export default SearchInput;
