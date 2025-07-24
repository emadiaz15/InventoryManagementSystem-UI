// src/features/product/pages/ProductsList.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "@/pages/Layout";
import Toolbar from "@/components/common/Toolbar";
import Pagination from "@/components/ui/Pagination";
import SuccessMessage from "@/components/common/SuccessMessage";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/ui/Spinner";
import Filter from "@/components/ui/Filter";

import ProductModals from "@/features/product/components/ProductModals";
import ProductTable from "@/features/product/components/ProductTable";

import { useProducts } from "@/features/product/hooks/useProductHooks";
import { useAuth } from "@/context/AuthProvider";

const ProductsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStaff = user?.is_staff;

  // 1️⃣ Hooks: siempre al tope
  const [filters, setFilters] = useState({ code: "" });
  const [pageUrl, setPageUrl] = useState(null);

  const {
    products,
    loading: loadingProducts,
    error: fetchError,
    nextPageUrl,
    previousPageUrl,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts(filters, pageUrl);

  // 2️⃣ Estados de UI
  const [modalState, setModalState] = useState({ type: null, productData: null });
  const openModal = useCallback((type, data = null) => {
    setModalState({ type, productData: data });
  }, []);
  const closeModal = useCallback(() => {
    setModalState({ type: null, productData: null });
  }, []);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 3️⃣ Mensaje de éxito
  const handleSave = useCallback((msg) => {
    setPageUrl(null);
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, []);

  // 4️⃣ Filtros UI
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPageUrl(null);
  }, []);

  const filterColumns = useMemo(
    () => [{ key: "code", label: "Código", filterable: true, type: "number" }],
    []
  );

  // 5️⃣ CRUD handlers
  const handleCreate = useCallback(
    async (formData) => {
      try {
        await createProduct(formData);
        handleSave("¡Producto creado con éxito!");
        closeModal();
      } catch (err) {
        console.error("Error creando producto:", err);
      }
    },
    [createProduct, handleSave, closeModal]
  );

  const handleUpdate = useCallback(
    async (id, formData) => {
      try {
        await updateProduct(id, formData);
        handleSave("¡Producto actualizado con éxito!");
        closeModal();
      } catch (err) {
        console.error("Error actualizando producto:", err);
      }
    },
    [updateProduct, handleSave, closeModal]
  );

  const handleDelete = useCallback(
    async (prd) => {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        await deleteProduct(prd.id);
        handleSave("¡Producto eliminado con éxito!");
        closeModal();
      } catch (err) {
        setDeleteError(err.message || "Error al eliminar producto.");
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteProduct, handleSave, closeModal]
  );

  return (
    <>
      <Layout isLoading={loadingProducts}>
        {showSuccess && (
          <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
        )}

        <div className="px-4 pb-4 pt-12">
          <Toolbar
            title="Lista de Productos"
            buttonText="Crear Producto"
            onButtonClick={() => openModal("create")}
            configItems={[
              { label: "Categorías", onClick: () => navigate("/categories"), adminOnly: true },
              { label: "Tipos", onClick: () => navigate("/types"), adminOnly: true },
            ]}
          />

          <Filter columns={filterColumns} onFilterChange={handleFilterChange} />

          {fetchError && <ErrorMessage message={fetchError.message} />}

          {loadingProducts ? (
            <div className="my-12 flex justify-center">
              <Spinner size="6" />
            </div>
          ) : products.length > 0 ? (
            <ProductTable
              products={products}
              onView={(p) => openModal("view", p)}
              onEdit={(p) => openModal("edit", p)}
              onDelete={(p) => openModal("deleteConfirm", p)}
              onShowSubproducts={(p) => navigate(`/products/${p.id}/subproducts`)}
              onViewHistory={(p) => navigate(`/products/${p.id}/history`)}
              user={user}
            />
          ) : (
            <p className="text-center py-10">No se encontraron productos.</p>
          )}

          <Pagination
            onNext={nextPageUrl ? () => setPageUrl(nextPageUrl) : undefined}
            onPrevious={previousPageUrl ? () => setPageUrl(previousPageUrl) : undefined}
            hasNext={Boolean(nextPageUrl)}
            hasPrevious={Boolean(previousPageUrl)}
          />
        </div>
      </Layout>

      <ProductModals
        modalState={modalState}
        closeModal={closeModal}
        onCreateProduct={handleCreate}
        onUpdateProduct={handleUpdate}
        handleSave={handleSave}
        onDeleteProduct={handleDelete}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={() => setDeleteError(null)}
      />
    </>
  );
};

export default ProductsList;
