import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import ProductFilter from "../components/ProductFilter";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import CreateProductFormModal from "../components/CreateProductFormModal";
import { listProducts } from "../services/listProducts";
import { listTypes } from "../../type/services/listType"; // Servicio para obtener los tipos
import { listCategories } from "../../category/services/listCategory"; // Servicio para obtener las categorías
import { useAuth } from "../../../context/AuthProvider";
import { PencilIcon, EyeIcon, TrashIcon, FolderIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import ProductViewModal from "../components/ProductViewModal"; // Modal para ver detalles del producto

const ProductsList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]); // Almacena los tipos
  const [categories, setCategories] = useState([]); // Almacena las categorías
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductViewModal, setShowProductViewModal] = useState(false); // Modal para ver detalles del producto
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Función para obtener productos con paginación
  const fetchProducts = async (url = "/inventory/products/") => {
    setLoading(true);
    try {
      const data = await listProducts(url);
      setProducts(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      setError("Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la lista de tipos
  const fetchTypesData = async () => {
    try {
      const data = await listTypes("/inventory/types/");
      setTypes(data.activeTypes || []); // En el servicio se devuelve activeTypes
    } catch (err) {
      console.error("Error al obtener los tipos:", err);
    }
  };

  // Función para obtener la lista de categorías
  const fetchCategoriesData = async () => {
    try {
      const data = await listCategories("/inventory/categories/");
      setCategories(data.results || []);
    } catch (err) {
      console.error("Error al obtener las categorías:", err);
    }
  };

  // Función para obtener el nombre del tipo a partir del ID
  const getTypeName = (typeId) => {
    const typeFound = types.find((t) => t.id === typeId);
    return typeFound ? typeFound.name : "Sin tipo";
  };

  // Función para obtener el nombre de la categoría a partir del ID
  const getCategoryName = (categoryId) => {
    const categoryFound = categories.find((c) => c.id === categoryId);
    return categoryFound ? categoryFound.name : "Sin categoría";
  };

  useEffect(() => {
    fetchProducts();
    fetchTypesData();
    fetchCategoriesData();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductViewModal(true);
  };

  const handleViewSubproducts = (product) => {
    // Redirige a la página de subproductos utilizando el ID del producto
    navigate(`/products/${product.id}/subproducts`);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  const handleDeleteProduct = (product) => {
    console.log("Eliminar producto:", product);
    // Aquí puedes agregar la lógica para eliminar (soft delete) el producto
  };

  const handleViewComments = (product) => {
    // Redirige a la página de comentarios del producto
    navigate(`/products/${product.id}/comments`);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    fetchProducts();
    // Puedes implementar un SuccessMessage
    setTimeout(() => { }, 2000);
  };

  // Construir filas para la tabla según los encabezados solicitados
  const rows =
    products.length > 0
      ? products.map((product) => ({
        Código: product.code,
        Tipo: getTypeName(product.type),
        Nombre: product.name,
        Cantidad: product.quantity,
        Categoría: getCategoryName(product.category),
        Acciones: (
          <div className="flex space-x-2">
            {/* Botón para ver detalle (abre modal) */}
            <button
              onClick={() => handleViewProduct(product)}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
              aria-label="View product details"
            >
              <EyeIcon className="w-5 h-5 text-white" />
            </button>
            {/* Botón para ver subproductos */}
            <button
              onClick={() => handleViewSubproducts(product)}
              className="bg-indigo-500 p-2 rounded hover:bg-indigo-600 transition-colors"
              aria-label="View subproducts"
            >
              <FolderIcon className="w-5 h-5 text-white" />
            </button>
            {/* Botón para editar */}
            <button
              onClick={() => handleEditProduct(product)}
              className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
              aria-label="Edit product"
            >
              <PencilIcon className="w-5 h-5 text-white" />
            </button>
            {/* Botón para ver comentarios */}
            <button
              onClick={() => handleViewComments(product)}
              className="bg-green-500 p-2 rounded hover:bg-green-600 transition-colors"
              aria-label="View product comments"
            >
              <ChatBubbleLeftIcon className="w-5 h-5 text-white" />
            </button>
            {/* Botón para eliminar */}
            <button
              onClick={() => handleDeleteProduct(product)}
              className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
              aria-label="Delete product"
            >
              <TrashIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        ),
      }))
      : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-2 mt-14 ml-64">
          <Toolbar
            title="Lista de Productos"
            buttonText="Crear Producto"
            onButtonClick={() => setShowCreateModal(true)}
          />
          <ProductFilter />
          {error ? (
            <div className="text-red-500 text-center mt-4">{error}</div>
          ) : (
            <Table
              headers={["Código", "Tipo", "Nombre", "Cantidad", "Categoría", "Acciones"]}
              rows={rows}
            />
          )}
          <Pagination
            onNext={() => nextPage && fetchProducts(nextPage)}
            onPrevious={() => previousPage && fetchProducts(previousPage)}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
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

      {/* Modal para ver detalles del producto */}
      {showProductViewModal && selectedProduct && (
        <ProductViewModal
          product={selectedProduct}
          isOpen={showProductViewModal}
          onClose={() => setShowProductViewModal(false)}
        />
      )}

      {/* Aquí podrías agregar un SuccessMessage si lo deseas */}
    </div>
  );
};

export default ProductsList;
