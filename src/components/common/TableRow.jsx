import React from 'react';

const TableRow = ({ rowData, isEven }) => (
  <tr className={`border-b hover:bg-secondary-500 ${isEven ? 'bg-background-100' : 'bg-background-200'}` }>
    {Object.keys(rowData).map((key, index) => (
      <td key={index} className="px-6 py-4">
        {rowData[key]}
      </td>
    ))}
  </tr>
);

export default TableRow;
