import React from 'react';

const ProductRow = ({ product }) => {
  return (
    <tr>
      <td className="py-2 px-4 border-b">{product.code}</td>
      <td className="py-2 px-4 border-b">{product.name}</td>
      <td className="py-2 px-4 border-b">{product.category?.name || 'Sin categoría'}</td>
      <td className="py-2 px-4 border-b">{product.type?.name || 'Sin tipo'}</td>
      <td className="py-2 px-4 border-b">{product.user || 'Sin usuario'}</td>
      <td className="py-2 px-4 border-b">
        {product.comments.length > 0
          ? product.comments.map((comment) => (
              <p key={comment.id} className="text-sm">
                {comment.text}
              </p>
            ))
          : 'Sin comentarios'}
      </td>
    </tr>
  );
};

export default ProductRow;
