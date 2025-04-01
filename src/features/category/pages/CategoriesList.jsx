import React, { useState, useEffect, useCallback, useMemo } from "react";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { listCategories } from "../services/listCategory";
import { updateCategory } from "../services/updateCategory";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import CategoryTable from "../components/CategoryTable";
import CategoryModals from "../components/CategoryModals";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("/inventory/categories/");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, category: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [filters, setFilters] = useState({ name: "" });

  const fetchCategories = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await listCategories(url);
      setCategories(response.results || []); // Asegúrate de actualizar el estado con los nuevos resultados
      setNextPageUrl(response.next);
      setPreviousPageUrl(response.previous);
      setCurrentPageUrl(url);
    } catch (err) {
      setError(err.message || "Error al obtener las categorías.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories(currentPageUrl);
  }, [fetchCategories, currentPageUrl]);

  const handleActionSuccess = useCallback((message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    closeModal();
    fetchCategories(currentPageUrl);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [currentPageUrl]);

  const handleDeleteCategory = useCallback(async (category) => {
    if (!category) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await updateCategory(category.id, { ...category, status: false });
      handleActionSuccess(`Categoría "${category.name}" eliminada (desactivada).`);
    } catch (err) {
      setDeleteError(err.message || "Error al eliminar la categoría.");
    } finally {
      setIsDeleting(false);
    }
  }, [currentPageUrl]);

  const handleUpdateCategory = useCallback(async (categoryId, updatedData) => {
    try {
      await updateCategory(categoryId, updatedData);
      handleActionSuccess(`Categoría "${updatedData.name}" actualizada.`);
    } catch (err) {
      setError(err.message || "Error al actualizar la categoría.");
    }
  }, [currentPageUrl]);

  const openCreateModal = useCallback(() => setModalState({ type: 'create', category: null }), []);
  const openEditModal = useCallback((category) => setModalState({ type: 'edit', category }), []);
  const openViewModal = useCallback((category) => setModalState({ type: 'view', category }), []);
  const openDeleteConfirmModal = useCallback((category) => setModalState({ type: 'deleteConfirm', category }), []);
  const closeModal = useCallback(() => setModalState({ type: null, category: null }), []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const columns = useMemo(() => [{ key: "name", label: "Nombre", filterable: true }], []);

  const buildQueryString = (filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  };

  const fetchFilteredCategories = useCallback(async () => {
    const query = buildQueryString(filters);
    const url = `/inventory/categories/${query ? `?${query}` : ''}`;
    fetchCategories(url);
  }, [filters, fetchCategories]);

  useEffect(() => {
    fetchFilteredCategories();
  }, [fetchFilteredCategories]);

  return (
    <>
      <Layout>
        {showSuccess && <div className="fixed top-20 right-5 z-[10000]"><SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} /></div>}
        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar title="Lista de Categorías" onButtonClick={openCreateModal} buttonText="Nueva Categoría" />
          <Filter columns={columns} onFilterChange={handleFilterChange} />
          {error && <div className="my-4"><ErrorMessage message={error} onClose={() => setError(null)} /></div>}
          {loading && <div className="flex justify-center items-center h-64"> <Spinner /> </div>}
          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-10 px-4 bg-background-50 rounded-lg shadow-sm">
              <p className="text-text-secondary">No se encontraron categorías.</p>
              <button onClick={openCreateModal} className="mt-4 bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600">Crear la Primera Categoría</button>
            </div>
          )}
          {!loading && !error && categories.length > 0 && (
            <CategoryTable
              categories={categories}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              openDeleteConfirmModal={openDeleteConfirmModal}
              goToNextPage={() => nextPageUrl && fetchCategories(nextPageUrl)}
              goToPreviousPage={() => previousPageUrl && fetchCategories(previousPageUrl)}
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          )}
        </div>
      </Layout>
      <CategoryModals
        modalState={modalState}
        closeModal={closeModal}
        handleUpdateCategory={handleUpdateCategory}
        handleDeleteCategory={handleDeleteCategory}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={() => setDeleteError(null)}
        handleActionSuccess={handleActionSuccess}
        fetchCategories={fetchCategories}
      />
    </>
  );
};

export default CategoryList;