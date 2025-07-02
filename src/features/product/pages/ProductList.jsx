import React, { useState, useEffect, useCallback, useMemo } from "react";
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

import useProducts from "../hooks/useProducts";
import { useAuth } from "../../../context/AuthProvider";
import { deleteProduct } from "../services/deleteProduct";

const ProductsList = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [modalState, setModalState] = useState({ type: null, productData: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [filters, setFilters] = useState({ code: "" });
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const {
    products,
    loadingProducts,
    error: fetchError,
    nextPageUrl,
    previousPageUrl,
    fetchProducts,
    next,
    previous,
    currentUrl,
  } = useProducts(filters);

  const [initialLoaded, setInitialLoaded] = useState(false);
  useEffect(() => {
    if (!loadingProducts && products !== null) {
      setInitialLoaded(true);
    }
  }, [loadingProducts, products]);

  const handleViewProduct = (product) =>
    setModalState({ type: "view", productData: product, showCarousel: true });

  const handleViewSubproducts = (product) =>
    navigate(`/products/${product.id}/subproducts`);

  const handleEditProduct = (product) =>
    setModalState({ type: "edit", productData: product });

  const handleDeleteClick = (modalConfig) =>
    setModalState(modalConfig);

  const handleViewHistory = (product) =>
    navigate(`/products/${product.id}/history`);

  const handleCloseModal = () =>
    setModalState({ type: null, productData: null });

  const handleSaveProduct = () => {
    fetchProducts(currentUrl);
    setSuccessMessage("¡Producto actualizado con éxito!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleConfirmDelete = async (product) => {
    setIsDeletingProduct(true);
    setDeleteError(null);
    try {
      await deleteProduct(product.id);
      await fetchProducts(currentUrl);
      setSuccessMessage("¡Producto eliminado con éxito!");
      setShowSuccess(true);
      setModalState({ type: null, productData: null });
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const filterColumns = useMemo(
    () => [{ key: "code", label: "Código", filterable: true, type: "number" }],
    []
  );

  return (
    <>
      <Layout isLoading={!initialLoaded}>
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

          {fetchError && (
            <div className="my-4">
              <ErrorMessage message={fetchError} />
            </div>
          )}

          {!initialLoaded ? (
            <div className="my-12 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : products?.length > 0 ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
              <ProductTable
                products={products}
                onView={handleViewProduct}
                onShowSubproducts={handleViewSubproducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
                onViewHistory={handleViewHistory}
                user={user}
              />
            </div>
          ) : (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron productos.</p>
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
        onDeleteProduct={handleConfirmDelete}
        isDeleting={isDeletingProduct}
        deleteError={deleteError}
        clearDeleteError={() => setDeleteError(null)}
      />
    </>
  );
};

export default ProductsList;
