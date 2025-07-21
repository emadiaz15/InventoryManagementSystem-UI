// src/features/category/pages/CategoryList.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";
import { useCategories } from "@/features/category/hooks/useCategories";

const CategoryList = () => {
  const navigate = useNavigate();

  // 1️⃣ Filtros de búsqueda / paginación
  const [filters, setFilters] = useState({ name: "", page: 1, page_size: 10 });

  // 2️⃣ Estados para modales y mensajes
  const [modalState, setModalState] = useState({ type: null, category: null });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  // 3️⃣ React Query hook para listado y mutaciones
  const {
    categories,
    total,
    nextPageUrl,
    previousPageUrl,
    loading,
    isError,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    prefetchPage,
  } = useCategories(filters);

  // 4️⃣ Columnas para el componente Filter
  const filterColumns = useMemo(
    () => [{ key: "name", label: "Nombre Categoría", filterType: "text" }],
    []
  );

  // 5️⃣ Handlers para abrir/cerrar modales
  const openCreateModal = () => setModalState({ type: "create", category: null });
  const openEditModal = (cat) => setModalState({ type: "edit", category: cat });
  const openViewModal = (cat) => setModalState({ type: "view", category: cat });
  const openDeleteConfirmModal = (cat) =>
    setModalState({ type: "deleteConfirm", category: cat });
  const closeModal = () => {
    setModalState({ type: null, category: null });
    setActionError(null);
  };

  // 6️⃣ Mostrar mensaje de éxito
  const handleActionSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    closeModal();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // 7️⃣ CRUD: creación, actualización y eliminación
  const handleCreateCategory = async (data) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const res = await createCategory(data);
      handleActionSuccess(`Categoría "${res.name}" creada.`);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message ||
        "Error al crear categoría.";
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateCategory = async ({ id, payload }) => {
    if (!modalState.category) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      const res = await updateCategory({ id, payload });
      handleActionSuccess(`Categoría "${res.name}" actualizada.`);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message ||
        "Error al actualizar categoría.";
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!modalState.category) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      await deleteCategory(modalState.category.id);
      handleActionSuccess(`Categoría "${modalState.category.name}" eliminada.`);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message ||
        "Error al eliminar categoría.";
      setActionError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  // 8️⃣ Paginación: cambiar página y prefetch
  const goToNextPage = () => {
    if (!nextPageUrl) return;
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    prefetchPage(nextPageUrl);
  };

  const goToPreviousPage = () => {
    if (!previousPageUrl) return;
    setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    prefetchPage(previousPageUrl);
  };

  return (
    <>
      <Layout>
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
            onButtonClick={openCreateModal}
            buttonText="Nueva Categoría"
          />

          <Filter
            columns={filterColumns}
            initialFilters={filters}
            onFilterChange={(newFilters) =>
              setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
            }
          />

          {isError && (
            <div className="my-4">
              <ErrorMessage
                message={error.message || "Error al cargar categorías."}
              />
            </div>
          )}

          {loading ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : categories.length > 0 ? (
            <CategoryTable
              categories={categories}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              openDeleteConfirmModal={openDeleteConfirmModal}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          ) : (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron categorías.</p>
            </div>
          )}
        </div>
      </Layout>

      <CategoryModals
        modalState={modalState}
        closeModal={closeModal}
        onCreate={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDelete={handleDeleteCategory}
        isProcessing={isProcessing}
        actionError={actionError}
      />
    </>
  );
};

export default CategoryList;
