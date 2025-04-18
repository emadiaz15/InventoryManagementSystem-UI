import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../pages/Layout";
import Toolbar from "../../../components/common/Toolbar";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Spinner from "../../../components/ui/Spinner";

import ProductModals from "../components/ProductModals";
import ProductTable from "../components/ProductTable";
import Filter from "../../../components/ui/Filter";

import { listTypes } from "../../type/services/listType";
import { listCategories } from "../../category/services/listCategory";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../../../context/AuthProvider";

const ProductsList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [modalState, setModalState] = useState({ type: null, productData: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [filters, setFilters] = useState({ code: "" });
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const {
    products,
    loadingProducts,
    error: fetchError,
    nextPageUrl,
    previousPageUrl,
    fetchProducts,
    next,
    previous,
    currentUrl
  } = useProducts(filters);

  const fetchTypesData = useCallback(async () => {
    try {
      const data = await listTypes("/inventory/types/");
      setTypes(data.activeTypes || data.results || []);
    } catch (err) {
      console.error("Error al obtener los tipos:", err);
    }
  }, []);

  const fetchCategoriesData = useCallback(async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const data = await listCategories("/inventory/categories/");
      setCategories(data.results || []);
    } catch (err) {
      console.error("Error al obtener las categorías:", err);
      setErrorCategories(err.message);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchCategoriesData();
    fetchTypesData();
  }, [isAuthenticated, fetchCategoriesData, fetchTypesData]);

  const getTypeName = useCallback((typeId) => types.find((t) => t.id === typeId)?.name || "Sin tipo", [types]);
  const getCategoryName = useCallback((categoryId) => categories.find((c) => c.id === categoryId)?.name || "Sin categoría", [categories]);

  const handleViewProduct = (product) => setModalState({ type: "view", productData: product, showCarousel: true });
  const handleViewSubproducts = (product) => navigate(`/products/${product.id}/subproducts`);
  const handleEditProduct = (product) => setModalState({ type: "edit", productData: product });
  const handleDeleteProduct = (modalConfig) => setModalState(modalConfig);
  const handleViewHistory = (product) => navigate(`/products/${product.id}/stock-history`);
  const handleCloseModal = () => setModalState({ type: null, productData: null });

  const handleSaveProduct = () => {
    fetchProducts(currentUrl);
    setSuccessMessage("¡Producto guardado con éxito!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filterColumns = useMemo(() => [
    { key: "code", label: "Código", filterable: true, type: "number" },
  ], []);

  if (loadingProducts && products.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-[10000]">
            <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar
            title="Lista de Productos"
            buttonText="Crear Producto"
            onButtonClick={() => setModalState({ type: "create", productData: null })}
          />

          <Filter columns={filterColumns} onFilterChange={handleFilterChange} />

          {fetchError ? (
            <div className="text-red-500 text-center mt-4">{fetchError}</div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
              <ProductTable
                products={products}
                onView={handleViewProduct}
                onShowSubproducts={handleViewSubproducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onViewHistory={handleViewHistory}
                getTypeName={getTypeName}
                getCategoryName={getCategoryName}
              />
            </div>
          )}

          <Pagination
            onNext={nextPageUrl ? next : undefined}
            onPrevious={previousPageUrl ? previous : undefined}
            hasNext={Boolean(nextPageUrl)}
            hasPrevious={Boolean(previousPageUrl)}
          />
        </div>
      </Layout>

      <ProductModals
        modalState={modalState}
        closeModal={handleCloseModal}
        onCreateProduct={handleSaveProduct}
        onUpdateProduct={handleSaveProduct}
        onDeleteProduct={() => { }}
        isDeleting={false}
        deleteError={null}
        clearDeleteError={() => { }}
      />
    </>
  );
};

export default ProductsList;
