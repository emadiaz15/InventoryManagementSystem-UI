// src/components/common/Table.jsx
import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead>
        <TableHeader headers={headers} />
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <TableRow key={index} rowData={row} />
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
