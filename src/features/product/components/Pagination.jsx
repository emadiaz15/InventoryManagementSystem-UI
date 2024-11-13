import React from 'react';

const Pagination = ({ page, totalPages, handlePageChange }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        className={`py-2 px-4 rounded bg-gray-200 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={page === 1}
      >
        Anterior
      </button>
      <span>Página {page} de {totalPages}</span>
      <button
        onClick={() => handlePageChange(page + 1)}
        className={`py-2 px-4 rounded bg-gray-200 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={page === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;
