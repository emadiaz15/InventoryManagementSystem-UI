// src/features/category/pages/CategoryList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "@/components/ui/Spinner";

import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";
import { useCategories } from "@/features/category/hooks/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/features/category/hooks/useCategoryMutations";


export default function CategoryList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ name: "", page: 1, page_size: 10 /* NO status */ }); const [modalState, setModalState] = useState({ type: null, category: null });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState(null);

  // 3️⃣ React Query hook para listado

  const {
    categories,
    nextPageUrl,
    previousPageUrl,
    loading,
    isError,
    error,
    prefetchPage,
    createStatus,
    updateStatus,
    deleteStatus,
  } = useCategories(filters);

  // 4️⃣ Mutaciones individuales
  const createMut = useCreateCategory();
  const updateMut = useUpdateCategory();
  const deleteMut = useDeleteCategory();

  // 4️⃣ Columnas para el componente Filter
  const filterColumns = useMemo(
    () => [{ key: "name", label: "Nombre Categoría", filterType: "text" }],
    []
  );

  const openModal = (type, category = null) => {
    setModalState({ type, category });
    setActionError(null);
  };
  const closeModal = () => setModalState({ type: null, category: null });

  const onSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    closeModal();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // create
  const handleCreate = async (data) => {
    try {
      const res = await createMut.mutateAsync(data);
      handleActionSuccess(`Categoría "${res.name}" creada.`);
    } catch (err) {
      setActionError(err.response?.data?.detail || err.message);
    }
  };
  // update
  const handleUpdate = async ({ id, payload }) => {
    try {
      const res = await updateMut.mutateAsync({ id, payload });
      handleActionSuccess(`Categoría "${res.name}" actualizada.`);
    } catch (err) {
      setActionError(err.response?.data?.detail || err.message);
    }
  };
  // delete
  const handleDelete = async () => {
    if (!modalState.category) return;
    try {
      await deleteMut.mutateAsync(modalState.category.id);
      handleActionSuccess(`Categoría "${modalState.category.name}" eliminada.`);
    } catch (err) {
      setActionError(err.response?.data?.detail || err.message);
    }
  };

  return (
    <>
      <Layout>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-50">
            <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar
            title="Lista de Categorías"
            onBackClick={() => navigate("/products")}
            onButtonClick={() => openModal("create")}
            buttonText="Nueva Categoría"
          />

          <Filter
            columns={filterColumns}
            initialFilters={filters}
            onFilterChange={(newF) => setFilters((f) => ({ ...f, ...newF, page: 1 }))}
          />

          {isError && <ErrorMessage message={error.message || "Error al cargar categorías."} />}

          {loading ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : categories.length > 0 ? (
            <CategoryTable
              categories={categories}
              openViewModal={(c) => openModal("view", c)}
              openEditModal={(c) => openModal("edit", c)}
              openDeleteConfirmModal={(c) => openModal("deleteConfirm", c)}
              goToNextPage={() => {
                setFilters((f) => ({ ...f, page: f.page + 1 }));
                prefetchPage(nextPageUrl);
              }}
              goToPreviousPage={() => {
                setFilters((f) => ({ ...f, page: f.page - 1 }));
                prefetchPage(previousPageUrl);
              }}
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          ) : (
            <p className="text-center py-10">No se encontraron categorías.</p>
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
            ? createStatus
            : modalState.type === "edit"
              ? updateStatus
              : modalState.type === "deleteConfirm"
                ? deleteStatus
                : false
        }
        actionError={actionError}
      />
    </>
  );
}
