// src/features/category/pages/CategoryList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "@/components/ui/Spinner";
import Pagination from "../../../components/ui/Pagination";

import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";
import { useCategories } from "../hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategoryMutations";

export default function CategoryList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: "",
    page: 1,
    page_size: 10,
  });
  const [modalState, setModalState] = useState({ type: null, category: null });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState(null);

  // 📦 React Query hook para listado paginado
  const {
    categories,
    nextPageUrl,
    previousPageUrl,
    loading,
    isError,
    error,
  } = useCategories(filters);

  // ⚙️ Mutaciones
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  // 📝 Filtros de búsqueda
  const filterColumns = useMemo(
    () => [{ key: "name", label: "Nombre Categoría", filterType: "text" }],
    []
  );

  // 🟢 Open/cerrar modales
  const openModal = (type, category = null) => {
    setModalState({ type, category });
    setActionError(null);
  };
  const closeModal = () => setModalState({ type: null, category: null });

  // 🟢 Mostrar mensaje de éxito
  const onSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    closeModal();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // ➕ Crear categoría
  const handleCreate = async (data) => {
    try {
      const created = await createMut.mutateAsync(data);
      onSuccess(`Categoría "${created.name}" creada.`);
      setFilters((f) => ({ ...f, page: 1 })); // <- SIEMPRE página 1 tras crear
    } catch (err) {
      setActionError(err.response?.data?.detail || err.message);
    }
  };

  // ✏️ Editar categoría
  const handleUpdate = async ({ id, payload }) => {
    try {
      const updated = await updateMut.mutateAsync({ id, payload });
      onSuccess(`Categoría "${updated.name}" actualizada.`);
      setFilters((f) => ({ ...f, page: 1 })); // <- página 1 tras editar
    } catch (err) {
      setActionError(err.response?.data?.detail || err.message);
    }
  };

  // 🗑️ Eliminar categoría
  const handleDelete = async () => {
    if (!modalState.category) return;
    try {
      await deleteMut.mutateAsync(modalState.category.id);
      onSuccess(`Categoría "${modalState.category.name}" eliminada.`);
      setFilters((f) => ({ ...f, page: 1 })); // <- página 1 tras eliminar
    } catch (err) {
      setActionError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <>
      <Layout isLoading={loading}>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-50">
            <SuccessMessage
              message={successMessage}
              onClose={() => setShowSuccess(false)}
            />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar
            title="Lista de Categorías"
            onBackClick={() => navigate("/product-list")}
            onButtonClick={() => openModal("create")}
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
                  openViewModal={(c) => openModal("view", c)}
                  openEditModal={(c) => openModal("edit", c)}
                  openDeleteConfirmModal={(c) => openModal("deleteConfirm", c)}
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
        modalState={modalState}
        closeModal={closeModal}
        onCreate={handleCreate}
        onUpdateCategory={handleUpdate}
        onDelete={handleDelete}
        isProcessing={
          modalState.type === "create"
            ? createMut.isLoading
            : modalState.type === "edit"
              ? updateMut.isLoading
              : modalState.type === "deleteConfirm"
                ? deleteMut.isLoading
                : false
        }
        actionError={actionError}
      />
    </>
  );
}
