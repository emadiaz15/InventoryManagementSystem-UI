import React from 'react';
import ProductRow from './ProductRow';

const ProductTable = ({ products }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Código</th>
          <th className="py-2 px-4 border-b">Nombre</th>
          <th className="py-2 px-4 border-b">Categoría</th>
          <th className="py-2 px-4 border-b">Tipo</th>
          <th className="py-2 px-4 border-b">Usuario</th>
          <th className="py-2 px-4 border-b">Comentarios</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
