import React, { useState, useEffect, useCallback, useMemo } from "react";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { listTypes } from "../services/listType";
import { updateType } from "../services/updateType";
import { createType } from "../services/createType";
import { listCategories } from "../../category/services/listCategory";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import TypeTable from "../components/TypeTable";
import TypeModals from "../components/TypeModals";

const TypeList = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("/inventory/types/");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, typeData: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [filters, setFilters] = useState({ name: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchTypes = useCallback(async (url) => {
    setLoading(true);
    try {
      const response = await listTypes(url);
      setTypes(response.results || []);
      setNextPageUrl(response.next);
      setPreviousPageUrl(response.previous);
      setCurrentPageUrl(url);
      setError(null);
    } catch (err) {
      setError(err.message || "Error al obtener los tipos.");
      setTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllCategories = useCallback(async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const response = await listCategories("/inventory/categories/?limit=1000&status=true");
      setCategories(response.results || []);
    } catch (err) {
      setErrorCategories(err.message || "Error al obtener las categorías.");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  }, []);

  useEffect(() => {
    const init = async () => {
      const query = buildQueryString(filters);
      const initialUrl = `/inventory/types/${query}`;
      await Promise.all([fetchTypes(initialUrl), fetchAllCategories()]);
      setInitialLoaded(true); // 🚀 solo cuando ambas cargas se completan
    };
    init();
  }, [fetchTypes, buildQueryString, fetchAllCategories]);

  useEffect(() => {
    if (initialLoaded) {
      const query = buildQueryString(filters);
      const url = `/inventory/types/${query}`;
      fetchTypes(url);
    }
  }, [filters, buildQueryString, fetchTypes, initialLoaded]);

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, typeData: data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, typeData: null });
    setDeleteError(null);
  }, []);

  const handleActionSuccess = useCallback((message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    closeModal();
    fetchTypes(currentPageUrl);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [currentPageUrl, fetchTypes, closeModal]);

  const handleDeleteType = useCallback(async (typeToDelete) => {
    if (!typeToDelete) return;
    setIsDeleting(true);
    try {
      await updateType(typeToDelete.id, { status: false });
      handleActionSuccess(`Tipo "${typeToDelete.name}" eliminado.`);
    } catch (err) {
      setDeleteError(err.message || "Error al eliminar el tipo.");
    } finally {
      setIsDeleting(false);
    }
  }, [handleActionSuccess]);

  const handleCreateType = useCallback(async (newTypeData) => {
    const createdType = await createType(newTypeData);
    handleActionSuccess(`Tipo "${createdType.name}" creado exitosamente.`);
  }, [handleActionSuccess]);

  const handleUpdateType = useCallback(async (typeId, updatedData) => {
    await updateType(typeId, updatedData);
    handleActionSuccess(`Tipo "${updatedData.name}" actualizado.`);
  }, [handleActionSuccess]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const categoryOptionsForFilter = useMemo(() => [
    { value: "", label: "Todas las Categorías" },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ], [categories]);

  const columns = useMemo(() => [
    { key: "name", label: "Tipo", filterable: true, type: "text" },
    { key: "category", label: "Categoría", filterable: true, type: "select", options: categoryOptionsForFilter }
  ], [categoryOptionsForFilter]);

  const getCategoryName = useCallback((categoryId) => {
    const id = typeof categoryId === "string" ? parseInt(categoryId, 10) : categoryId;
    if (loadingCategories) return "Cargando...";
    return categories.find(cat => cat.id === id)?.name || "SIN CATEGORÍA";
  }, [categories, loadingCategories]);

  return (
    <>
      <Layout>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-[10000]">
            <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar title="Lista de Tipos" onButtonClick={() => openModal("create")} buttonText="Nuevo Tipo" />
          <Filter columns={columns} onFilterChange={handleFilterChange} />

          {error && !loading && (
            <div className="my-4">
              <ErrorMessage message={error} onClose={() => setError(null)} />
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center h-32">
              <Spinner />
            </div>
          )}

          {!loading && types.length === 0 && (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron tipos que coincidan con los filtros.</p>
            </div>
          )}

          {!loading && types.length > 0 && (
            <TypeTable
              types={types}
              openViewModal={(data) => openModal("view", data)}
              openEditModal={(data) => openModal("edit", data)}
              openDeleteConfirmModal={(data) => openModal("deleteConfirm", data)}
              getCategoryName={getCategoryName}
              goToNextPage={nextPageUrl ? () => fetchTypes(nextPageUrl) : null}
              goToPreviousPage={previousPageUrl ? () => fetchTypes(previousPageUrl) : null}
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          )}
        </div>
      </Layout>

      <TypeModals
        modalState={modalState}
        closeModal={closeModal}
        onCreateType={handleCreateType}
        onUpdateType={handleUpdateType}
        onDeleteType={handleDeleteType}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={() => setDeleteError(null)}
        categories={categories}
        loadingCategories={loadingCategories}
        getCategoryName={getCategoryName}
      />
    </>
  );
};

export default TypeList;
