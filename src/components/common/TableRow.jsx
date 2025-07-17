import React from 'react';

const TableRow = ({ rowData, isEven }) => (
  <tr className={`border-b bg-primary-700 hover:bg-primary-500  transition-all ${isEven ? 'bg-background-100' : 'bg-background-200'}`}>
    {Object.keys(rowData).map((key, index) => (
      <td key={index} className="px-6 py-3 text-text-primary">
        {rowData[key]}
      </td>
    ))}
  </tr>
);

export default TableRow;
