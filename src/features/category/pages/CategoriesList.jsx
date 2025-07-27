// src/features/category/pages/CategoryList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "@/components/common/Toolbar";
import SuccessMessage from "@/components/common/SuccessMessage";
import ErrorMessage from "@/components/common/ErrorMessage";
import Filter from "@/components/ui/Filter";
import Layout from "@/pages/Layout";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";

import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";
import { useCategories } from "../hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategoryMutations";

import useEntityModal from "@/hooks/useEntityModal";
import useSuccess from "@/hooks/useSuccess";

export default function CategoryList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    page: 1,
    page_size: 10,
  });

  const {
    successMessage,
    error: actionError,
    handleSuccess,
    handleError,
    clear: clearStatus,
  } = useSuccess();

  const deleteMut = useDeleteCategory();

  const {
    showCreateModal,
    showEditModal,
    showViewModal,
    showConfirmDialog,
    selectedEntity: selectedCategory,
    entityToDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    openConfirmDialog,
    handleDelete: handleDeleteModal,
    closeAllModals, // ✅ usamos el correcto
  } = useEntityModal({
    onDelete: async (cat) => {
      try {
        await deleteMut.mutateAsync(cat.id);
        handleSuccess(`Categoría "${cat.name}" eliminada.`);
        setFilters((f) => ({ ...f, page: 1 }));
      } catch (err) {
        handleError(err);
      }
    },
  });

  const {
    categories,
    nextPageUrl,
    previousPageUrl,
    loading,
    isError,
    error,
  } = useCategories(filters);

  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();

  const filterColumns = useMemo(
    () => [{ key: "name", label: "Nombre Categoría", filterType: "text" }],
    []
  );

  const handleCreate = async (data) => {
    clearStatus();
    try {
      const created = await createMut.mutateAsync(data);
      handleSuccess(`Categoría "${created.name}" creada.`);
      setFilters((f) => ({ ...f, page: 1 }));
      closeAllModals();
    } catch (err) {
      handleError(err);
    }
  };

  const handleUpdate = async ({ id, payload }) => {
    clearStatus();
    try {
      const updated = await updateMut.mutateAsync({ id, payload });
      handleSuccess(`Categoría "${updated.name}" actualizada.`);
      setFilters((f) => ({ ...f, page: 1 }));
      closeAllModals(); // ✅ cerrar el modal manualmente después del éxito
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <Layout isLoading={loading}>
        {successMessage && (
          <div className="fixed top-20 right-5 z-50">
            <SuccessMessage message={successMessage} onClose={clearStatus} />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar
            title="Lista de Categorías"
            onBackClick={() => navigate("/product-list")}
            onButtonClick={openCreateModal}
            buttonText="Nueva Categoría"
          />

          <Filter
            columns={filterColumns}
            initialFilters={filters}
            onFilterChange={(newF) =>
              setFilters((f) => ({ ...f, ...newF, page: 1 }))
            }
          />

          {isError && (
            <ErrorMessage message={error.message || "Error al cargar categorías."} />
          )}

          {loading ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : (
            <>
              {categories.length > 0 ? (
                <CategoryTable
                  categories={categories}
                  openViewModal={openViewModal}
                  openEditModal={openEditModal}
                  openDeleteConfirmModal={openConfirmDialog}
                />
              ) : (
                <p className="text-center py-10">No se encontraron categorías.</p>
              )}

              <Pagination
                onNext={nextPageUrl ? () => setFilters(f => ({ ...f, page: f.page + 1 })) : undefined}
                onPrevious={previousPageUrl ? () => setFilters(f => ({ ...f, page: f.page - 1 })) : undefined}
                hasNext={Boolean(nextPageUrl)}
                hasPrevious={Boolean(previousPageUrl)}
              />
            </>
          )}
        </div>
      </Layout>

      <CategoryModals
        category={selectedCategory}
        categoryToDelete={entityToDelete}
        showCreateModal={showCreateModal}
        showEditModal={showEditModal}
        showViewModal={showViewModal}
        showConfirmDialog={showConfirmDialog}
        closeAllModals={closeAllModals}
        onCreate={handleCreate}
        onUpdateCategory={handleUpdate}
        onDelete={handleDeleteModal}
        isProcessing={
          createMut.isLoading || updateMut.isLoading || deleteMut.isLoading
        }
        error={actionError}
      />
    </>
  );
}
