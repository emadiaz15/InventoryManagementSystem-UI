// src/components/common/TableRow.jsx
import React from 'react';

const TableRow = ({ rowData }) => (
  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
    {Object.keys(rowData).map((key, index) => (
      <td key={index} className="px-6 py-4">
        {/* Renderiza el contenido sin modificarlo, permitiendo JSX */}
        {rowData[key]}
      </td>
    ))}
  </tr>
);

export default TableRow;
