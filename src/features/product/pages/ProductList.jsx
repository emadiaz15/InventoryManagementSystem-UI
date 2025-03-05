import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import CreateProductFormModal from "../components/CreateProductFormModal";
import ProductFilter from "../components/ProductFilter";
import { listProducts } from "../services/listProducts";
import { PencilIcon, EyeIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await listProducts(`/inventory/products/`);
      setProducts(data.results || []);
    } catch (error) {
      setError("Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubproducts = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    fetchProducts();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const rows = products.length > 0 ? (
    products.map((product) => ({
      Código: product.code,
      Tipo: product.type?.name || "Sin tipo",
      Nombre: product.name,
      Stock: product.total_stock !== undefined ? product.total_stock : "N/A",
      Acciones: (
        <div className="flex space-x-2">
          {/* Botón de Ver Subproductos */}
          <button onClick={() => handleViewSubproducts(product.id)} className="bg-secondary-500 p-2 rounded hover:bg-secondary-600">
            <EyeIcon className="w-5 h-5 text-white" />
          </button>

          {/* Botón de Editar Producto */}
          <button onClick={() => handleEditProduct(product)} className="bg-primary-500 p-2 rounded hover:bg-primary-600">
            <PencilIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      ),
    }))
  ) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-2 mt-14 ml-64">
          <Toolbar title="Lista de Productos" buttonText="Crear Producto" onButtonClick={() => setShowCreateModal(true)} />
          <ProductFilter />
          {error ? (
            <div className="text-red-500 text-center mt-4">{error}</div>
          ) : (
            <Table headers={["Código", "Tipo", "Nombre", "Stock", "Acciones"]} rows={rows} />
          )}
        </div>
      </div>
      <Footer />

      {/* Modal para Crear/Editar Producto */}
      {showCreateModal && (
        <CreateProductFormModal
          product={selectedProduct}
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      )}

      {/* Mensaje de éxito */}
      {showSuccess && <SuccessMessage message="¡Producto guardado exitosamente!" onClose={() => setShowSuccess(false)} />}
    </div>
  );
};

export default ProductsList;
