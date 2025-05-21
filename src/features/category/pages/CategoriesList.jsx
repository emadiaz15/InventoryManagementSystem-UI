import React, { useState, useCallback, useMemo } from "react";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";

// Servicios API
import { createCategory } from "../services/createCategory";
import { updateCategory } from "../services/updateCategory";

// Hooks
import useCategories from "../hooks/useCategories";

const CategoryList = () => {
  const [filters, setFilters] = useState({ name: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, category: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const {
    categories,
    loadingCategories,
    error: fetchError,
    nextPageUrl,
    previousPageUrl,
    fetchCategories,
    next: goToNextPage,
    previous: goToPreviousPage,
    currentUrl: currentCategoriesUrl,
  } = useCategories(filters);

  const filterColumns = useMemo(() => [
    { key: "name", label: "Nombre Categoría", filterType: "text" },
  ], []);

  const openCreateModal = useCallback(() => setModalState({ type: "create", category: null }), []);
  const openEditModal = useCallback((category) => setModalState({ type: "edit", category }), []);
  const openViewModal = useCallback((category) => setModalState({ type: "view", category }), []);
  const openDeleteConfirmModal = useCallback((category) => setModalState({ type: "deleteConfirm", category }), []);
  const closeModal = useCallback(() => {
    setModalState({ type: null, category: null });
    setActionError(null);
  }, []);

  const handleActionSuccess = useCallback((message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    closeModal();
    if (fetchCategories && currentCategoriesUrl) {
      fetchCategories(currentCategoriesUrl);
    }
    setTimeout(() => setShowSuccess(false), 3000);
  }, [currentCategoriesUrl, fetchCategories, closeModal]);

  const handleCreateCategory = useCallback(async (newCategoryData) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const createdCategory = await createCategory(newCategoryData);
      handleActionSuccess(`Categoría "${createdCategory.name}" creada.`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Error al crear categoría.";
      const validationErrs =
        (err.response?.data && typeof err.response.data === "object" && err.response.status === 400)
          ? err.response.data
          : null;
      setActionError({ message: errorMsg, details: validationErrs });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  const handleUpdateCategory = useCallback(async (categoryId, updatedData) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      const updatedCategory = await updateCategory(categoryId, updatedData);
      handleActionSuccess(`Categoría "${updatedCategory.name}" actualizada.`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Error al actualizar categoría.";
      const validationErrs =
        (err.response?.data && typeof err.response.data === "object" && err.response.status === 400)
          ? err.response.data
          : null;
      setActionError({ message: errorMsg, details: validationErrs });
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  const handleDeleteCategory = useCallback(async (categoryToDelete) => {
    if (!categoryToDelete) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      await updateCategory(categoryToDelete.id, {
        name: categoryToDelete.name,
        description: categoryToDelete.description,
        status: false
      });
      handleActionSuccess(`Categoría "${categoryToDelete.name}" desactivada.`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Error al desactivar categoría.";
      setActionError({ message: errorMsg });
    } finally {
      setIsProcessing(false);
    }
  }, [handleActionSuccess]);

  const isInitialLoading = loadingCategories && categories.length === 0;
  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-3.5rem)] bg-background-100">
        <Spinner size="8" color="text-primary-500" />
      </div>
    );
  }
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
            title="Lista de Categorías"
            onButtonClick={openCreateModal}
            buttonText="Nueva Categoría"
          />

          <Filter columns={filterColumns} onFilterChange={setFilters} initialFilters={filters} />

          {fetchError && (
            <div className="my-4">
              <ErrorMessage message={fetchError.message || "Error al cargar datos."} />
            </div>
          )}

          {loadingCategories && categories.length > 0 && (
            <div className="my-4 flex justify-center">
              <Spinner />
            </div>
          )}

          {!loadingCategories && categories.length > 0 && (
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
          )}

          {!loadingCategories && categories.length === 0 && (
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
