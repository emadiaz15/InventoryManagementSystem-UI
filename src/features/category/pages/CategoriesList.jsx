// src/features/category/pages/CategoryList.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";  // ← agregado
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";
import { useCategoriesQuery } from "@/features/category/queries/useCategoriesList";
import { useQueryClient } from "@tanstack/react-query";

const CategoryList = () => {
  const navigate = useNavigate();  // ← agregado

  const [filters, setFilters] = useState({ name: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, category: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const queryClient = useQueryClient();

  const {
    categories,
    loadingCategories,
    error: fetchError,
    nextPageUrl,
    previousPageUrl,
    next: goToNextPage,
    previous: goToPreviousPage,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesQuery(filters);

  const filterColumns = useMemo(
    () => [{ key: "name", label: "Nombre Categoría", filterType: "text" }],
    []
  );

  const openCreateModal = () =>
    setModalState({ type: "create", category: null });
  const openEditModal = (category) =>
    setModalState({ type: "edit", category });
  const openViewModal = (category) =>
    setModalState({ type: "view", category });
  const openDeleteConfirmModal = (category) =>
    setModalState({ type: "deleteConfirm", category });
  const closeModal = () => {
    setModalState({ type: null, category: null });
    setActionError(null);
  };

  const handleActionSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    closeModal();
    queryClient.invalidateQueries(["categories"]);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCreateCategory = async (newCategoryData) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const createdCategory = await createCategory(newCategoryData);
      handleActionSuccess(`Categoría "${createdCategory.name}" creada.`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Error al crear categoría.";
      setActionError({ message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateCategory = async (updatedData) => {
    if (!modalState.category) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      const updatedCategory = await updateCategory(
        modalState.category.id,
        updatedData
      );
      handleActionSuccess(`Categoría "${updatedCategory.name}" actualizada.`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Error al actualizar categoría.";
      setActionError({ message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    if (!categoryToDelete) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      await deleteCategory(categoryToDelete.id);
      handleActionSuccess(`Categoría "${categoryToDelete.name}" eliminada.`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Error al eliminar categoría.";
      setActionError({ message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Layout>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-[10000]">
            <SuccessMessage
              message={successMessage}
              onClose={() => setShowSuccess(false)}
            />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar
            title="Lista de Categorías"
            onBackClick={() => navigate("/product-list")}  // ← actualizado
            onButtonClick={openCreateModal}
            buttonText="Nueva Categoría"
          />

          <Filter
            columns={filterColumns}
            onFilterChange={setFilters}
            initialFilters={filters}
          />

          {fetchError && (
            <div className="my-4">
              <ErrorMessage
                message={fetchError.message || "Error al cargar datos."}
              />
            </div>
          )}

          {loadingCategories ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : categories.length > 0 ? (
            <CategoryTable
              categories={categories}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              openDeleteConfirmModal={openDeleteConfirmModal}
              goToNextPage={nextPageUrl ? goToNextPage : null}
              goToPreviousPage={previousPageUrl ? goToPreviousPage : null}
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
        handleCreateCategory={handleCreateCategory}
        handleUpdateCategory={handleUpdateCategory}
        handleDeleteCategory={handleDeleteCategory}
        handleActionSuccess={handleActionSuccess}
        isDeleting={isProcessing}
        deleteError={actionError?.message}
        clearDeleteError={closeModal}
      />
    </>
  );
};

export default CategoryList;
