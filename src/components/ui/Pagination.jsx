// src/components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ onNext, onPrevious, hasNext, hasPrevious }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="bg-primary-500 text-text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        Anterior
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="bg-primary-500 text-text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
