import React from 'react';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-text-primary">
      <thead>
        <TableHeader headers={headers} />
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <TableRow key={index} rowData={row} isEven={index % 2 === 0} />
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;