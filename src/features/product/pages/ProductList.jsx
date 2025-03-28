import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import CreateProductFormModal from "../components/CreateProductFormModal";
import ProductFilter from "../components/ProductFilter";
import { listProducts } from "../services/listProducts";

import { listTypes } from "../../type/services/listType";
import { listCategories } from "../../category/services/listCategory";
import { useAuth } from "../../../context/AuthProvider";
import {
  PencilIcon,
  EyeIcon,
  TrashIcon,
  FolderIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import ProductViewModal from "../components/ProductViewModal";
import ProductCarouselOverlay from "../components/ProductCarouselOverlay";
import Layout from "../../../pages/Layout";


const ProductsList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductViewModal, setShowProductViewModal] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

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

  const fetchTypesData = async () => {
    try {
      const data = await listTypes("/inventory/types/");
      setTypes(data.activeTypes || []);
    } catch (err) {
      console.error("Error al obtener los tipos:", err);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await listCategories("/inventory/categories/");
      setCategories(data.results || []);
    } catch (err) {
      console.error("Error al obtener las categorías:", err);
    }
  };

  const getTypeName = (typeId) => {
    const typeFound = types.find((t) => t.id === typeId);
    return typeFound ? typeFound.name : "Sin tipo";
  };

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
    setShowCarousel(true);
  };

  const handleViewSubproducts = (product) => {
    navigate(`/products/${product.id}/subproducts`)
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowCreateModal(true);
  };

  const handleDeleteProduct = (product) => {
    console.log("Eliminar producto:", product);
  };

  const handleViewComments = (product) => {
    navigate(`/products/${product.id}/comments`);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowProductViewModal(false);
    setShowCarousel(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    fetchProducts();
    setTimeout(() => { }, 2000);
  };

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
            <button
              onClick={() => handleViewProduct(product)}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
              aria-label="View product details"
            >
              <EyeIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleViewSubproducts(product)}
              className="bg-indigo-500 p-2 rounded hover:bg-indigo-600 transition-colors"
              aria-label="View subproducts"
            >
              <FolderIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleEditProduct(product)}
              className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
              aria-label="Edit product"
            >
              <PencilIcon className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => navigate(`/product-stock-history/${product.id}`)}
              className="bg-yellow-500 p-2 rounded hover:bg-yellow-600 transition-colors"
              aria-label="Ver historial de stock"
            >
              <ClockIcon className="w-5 h-5 text-white" />
            </button>
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
    <>
      <Layout>
        <div className="flex-1 p-2 mt-14">
          <Toolbar
            title="Lista de Productos"
            buttonText="Crear Producto"
            onButtonClick={() => setShowCreateModal(true)}
          />
          <ProductFilter />
          {error ? (
            <div className="text-red-500 text-center mt-4">{error}</div>
          ) : (

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
              <Table
                headers={[
                  "Código",
                  "Tipo",
                  "Nombre",
                  "Stock",
                  "Categoría",
                  "Acciones",
                ]}
                rows={rows}
              />
            </div>
          )}
          <Pagination
            onNext={() => nextPage && fetchProducts(nextPage)}
            onPrevious={() => previousPage && fetchProducts(previousPage)}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </Layout>

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
        <>
          <ProductViewModal
            product={selectedProduct}
            isOpen={showProductViewModal}
            onClose={handleCloseModal}
          />
          <ProductCarouselOverlay
            images={selectedProduct.images}
            onClose={handleCloseModal}
          />
        </>
      )}
    </>
  );
};

export default ProductsList;
