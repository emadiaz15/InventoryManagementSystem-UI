// src/components/common/TableHeader.jsx
import React from 'react';

const TableHeader = ({ headers }) => (
  <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    {headers.map((header, index) => (
      <th key={index} className="px-6 py-3">
        {header}
      </th>
    ))}
  </tr>
);

export default TableHeader;
