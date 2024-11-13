// src/features/product/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { listProducts } from '../services/products/listProducts';
import { deleteProduct } from '../services/products/deleteProduct';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import Toolbar from '../../../components/common/Toolbar';
import Pagination from '../../../components/ui/Pagination';
import ProductCreateModal from '../components/ProductCreateModal';
import ProductEditModal from '../components/ProductEditModal';
import Table from '../../../components/common/Table';
import ButtonsActions from '../../../components/ui/ButtonsActions';

// Simulación de usuario actual
const currentUser = {
  isAdmin: true, // Cambia esto a `false` para simular un usuario no administrador
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (url = null) => {
    try {
      const response = await listProducts(url || '/inventory/products/');
      const activeProducts = Array.isArray(response)
        ? response.filter((product) => product.is_active)
        : response.results?.filter((product) => product.is_active) || [];

      setProducts(activeProducts);
      setFilteredProducts(activeProducts);
      setNextPage(response.next || null);
      setPreviousPage(response.previous || null);
    } catch (error) {
      setError('Error al obtener los productos.');
    }
  };

  const handleSearch = (query) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCreateProduct = () => {
    setShowCreateModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!currentUser.isAdmin) {
      alert("No tienes permisos para eliminar productos.");
      return;
    }

    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmed) return;

    try {
      await deleteProduct(productId);

      // Filtra el producto eliminado de la lista en el frontend
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      setFilteredProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    } catch (error) {
      console.error(`Error al eliminar el producto con ID ${productId}`, error);
      setError('No se pudo eliminar el producto.');
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchProducts(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchProducts(previousPage);
    }
  };

  const headers = [
    'Código',
    'Tipo',
    'Nombre del Producto',
    'Categoría',
    'Stock',
    'Acciones',
];

const rows = filteredProducts.map((product) => ({
    code: product.code,
    type: product.type ? product.type.name : 'Sin Tipo',  // Asegúrate de acceder a product.type.name
    name: product.name,
    category: product.category ? product.category.name : 'Sin Categoría',  // Asegúrate de acceder a product.category.name
    stock: product.stock ? product.stock.quantity : 'No Disponible',
    actions: (
      <ButtonsActions
        onEdit={() => handleEditProduct(product)}
        onDelete={() => handleDeleteProduct(product.id)}
      />
    ),
}));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 rounded-lg">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">
            <Toolbar onSearch={handleSearch} onCreate={handleCreateProduct} createButtonText="Nuevo Producto" />

            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <Table headers={headers} rows={rows} />
            )}

            {nextPage || previousPage ? (
              <Pagination
                onNext={handleNextPage}
                onPrevious={handlePreviousPage}
                hasNext={!!nextPage}
                hasPrevious={!!previousPage}
              />
            ) : null}
          </div>
        </div>
      </div>

      {showCreateModal && <ProductCreateModal onClose={() => setShowCreateModal(false)} />}
      
      {showEditModal && selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onSave={(updatedProduct) => {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
              )
            );
            setFilteredProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
              )
            );
            setShowEditModal(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
