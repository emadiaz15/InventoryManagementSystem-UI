import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import listProducts from '../services/listProducts'; // Importa el servicio de productos
import { deleteProduct } from '../services/deleteProduct';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import Table from '../../../components/common/Table';
import Pagination from '../../../components/ui/Pagination';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ProductModal from '../components/ProductModal';
import { ButtonsActions } from '../../../components/ui/ButtonsActions';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const fetchProducts = async (url = '/inventory/products/') => {
    setLoading(true);
    try {
      const data = await listProducts(url);
      setProducts(data.products || []); // Accede correctamente a la lista de productos
      setNextPage(data.nextPage || null);
      setPreviousPage(data.prevPage || null);
    } catch (error) {
      setError('Error al cargar los productos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
        setSuccessMessage('Producto eliminado correctamente.');
        setShowSuccess(true);
      } catch (error) {
        setError('No se pudo eliminar el producto.');
        console.error(error);
      }
    }
  };

  const headers = ['Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones'];
  const rows = products.map(product => ({
    Nombre: product.name,
    Categoría: product.category.name,
    Precio: `$${product.price}`,
    Stock: product.stock_quantity,
    Acciones: (
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
        <div className="flex-1 mt-14 p-2">
          {loading ? (
            <div className="text-center">Cargando productos...</div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <Table headers={headers} rows={rows} />
            </div>
          )}
          {error && <div className="text-red-500">{error}</div>}
          <Pagination
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </div>
      {showSuccess && <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSave={() => {
            fetchProducts();
            setSuccessMessage('Producto actualizado correctamente.');
            setShowSuccess(true);
          }}
        />
      )}
      <Footer />
    </div>
  );
};

export default ProductsList;
