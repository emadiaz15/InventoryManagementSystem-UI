import React from 'react';

const TableHeader = ({ headers }) => (
  <tr className="text-xs text-white uppercase bg-primary-500">
    {headers.map((header, index) => (
      <th key={index} className="px-6 py-3">
        {header}
      </th>
    ))}
  </tr>
);

export default TableHeader;