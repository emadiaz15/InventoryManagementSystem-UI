// src/components/common/Pagination.jsx
import React from 'react';

const Pagination = ({ onNext, onPrevious, hasNext, hasPrevious }) => {
  return (
    <div className="flex justify-between mt-4">
      <button
        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        onClick={onPrevious}
        disabled={!hasPrevious}
      >
        Anterior
      </button>
      <button
        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        onClick={onNext}
        disabled={!hasNext}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
