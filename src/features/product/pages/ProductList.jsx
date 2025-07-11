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

import {
  useListProducts,
  useDeleteProduct,
} from "@/features/product/hooks/useProductHooks";
import { useAuth } from "@/context/AuthProvider";

const ProductsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [modalState, setModalState] = useState({ type: null, productData: null });
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [filters, setFilters] = useState({ code: "" });
  const [pageUrl, setPageUrl] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const {
    products,
    loadingProducts,
    fetchError,
    nextPageUrl,
    previousPageUrl,
  } = useListProducts(filters, pageUrl);

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const openModal = (type, data = null) =>
    setModalState({ type, productData: data });
  const closeModal = () =>
    setModalState({ type: null, productData: null });

  const handleSave = (msg) => {
    // volvemos a primera página y mostramos mensaje
    setPageUrl(null);
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = async (prd) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteProduct(prd.id);
      handleSave("¡Producto eliminado con éxito!");
      closeModal();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPageUrl(null);
  }, []);

  const filterColumns = useMemo(
    () => [{ key: "code", label: "Código", filterable: true, type: "number" }],
    []
  );

  return (
    <>
      <Layout isLoading={loadingProducts}>
        {showSuccess && (
          <SuccessMessage
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}

        <div className="px-4 pb-4 pt-12">
          <Toolbar
            title="Lista de Productos"
            buttonText="Crear Producto"
            onButtonClick={() => openModal("create")}
            configItems={[
              { label: 'Categorías', onClick: () => navigate('/categories'), adminOnly: true },
              { label: 'Tipos', onClick: () => navigate('/types'), adminOnly: true },
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
              onShowSubproducts={(p) =>
                navigate(`/products/${p.id}/subproducts`)
              }
              onViewHistory={(p) =>
                navigate(`/products/${p.id}/history`)
              }
              user={user}
            />
          ) : (
            <p className="text-center py-10">
              No se encontraron productos.
            </p>
          )}

          <Pagination
            onNext={nextPageUrl ? () => setPageUrl(nextPageUrl) : undefined}
            onPrevious={
              previousPageUrl ? () => setPageUrl(previousPageUrl) : undefined
            }
            hasNext={Boolean(nextPageUrl)}
            hasPrevious={Boolean(previousPageUrl)}
          />
        </div>
      </Layout>

      <ProductModals
        modalState={modalState}
        closeModal={closeModal}
        onCreateProduct={() =>
          handleSave("¡Producto creado con éxito!")
        }
        onUpdateProduct={() =>
          handleSave("¡Producto actualizado con éxito!")
        }
        onDeleteProduct={handleDelete}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={() => setDeleteError(null)}
      />
    </>
  );
};

export default ProductsList;
