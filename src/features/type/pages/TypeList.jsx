import React, { useState, useEffect, useCallback, useMemo } from "react";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { listTypes } from "../services/listType";       // Espera { results, next, previous }
import { updateType } from "../services/updateType";
import { createType } from "../services/createType";
import { listCategories } from "../../category/services/listCategory";
import Filter from "../../../components/ui/Filter";         // Componente de Filtro
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import TypeTable from "../components/TypeTable";       // Tabla específica
import TypeModals from "../components/TypeModals";       // Contenedor de Modales

const TypeList = () => {
  // --- State (Estructura centralizada) ---
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error general o de carga/CRUD
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentPageUrl, setCurrentPageUrl] = useState("/inventory/types/"); // URL actual (con filtros/página)
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, typeData: null }); // Estado único para modales
  const [isDeleting, setIsDeleting] = useState(false);      // Estado específico para carga de eliminación
  const [deleteError, setDeleteError] = useState(null);     // Estado específico para error de eliminación
  const [filters, setFilters] = useState({ name: "", category: "" }); // Estado para filtros (2 campos)
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // --- Data Fetching (Usando servicio que devuelve raw data) ---
  const fetchTypes = useCallback(async (url) => {
    setLoading(true);
    console.log(`Workspaceing types from URL: ${url}`);
    try {
      const response = await listTypes(url);
      console.log("Data received in fetchTypes:", response);
      setTypes(response.results || []);
      setNextPageUrl(response.next);
      setPreviousPageUrl(response.previous);
      setCurrentPageUrl(url);
      setError(null);
    } catch (err) {
      console.error("Error in fetchTypes:", err);
      setError(err.message || "Error al obtener los tipos.");
      setTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Fetch Categories (Sin cambios) ---
  const fetchAllCategories = useCallback(async () => {
    setLoadingCategories(true);
    setErrorCategories(null);
    try {
      const response = await listCategories("/inventory/categories/?limit=1000&status=true");
      setCategories(response.results || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setErrorCategories(err.message || "Error al obtener las categorías.");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // --- Build Query String (Sin cambios) ---
  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    console.log("Built query string:", queryString);
    return queryString ? `?${queryString}` : "";
  }, []);

  // --- Effects ---
  useEffect(() => {
    console.log("Initial mount effect: fetching types and categories.");
    const initialQuery = buildQueryString(filters);
    const initialUrl = `/inventory/types/${initialQuery}`;
    fetchTypes(initialUrl);
    fetchAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    console.log("Filters changed, fetching filtered types:", filters);
    const query = buildQueryString(filters);
    const url = `/inventory/types/${query}`;
    fetchTypes(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // --- Modal Control ---
  const openCreateModal = useCallback(() => setModalState({ type: "create", typeData: null }), []);
  const openEditModal = useCallback((typeData) => setModalState({ type: "edit", typeData }), []);
  const openViewModal = useCallback((typeData) => setModalState({ type: "view", typeData }), []);
  const openDeleteConfirmModal = useCallback((typeData) => setModalState({ type: "deleteConfirm", typeData }), []);
  const closeModal = useCallback(() => {
    console.log("Closing modal.");
    setModalState({ type: null, typeData: null });
    setDeleteError(null);
  }, []);

  // --- Handlers CRUD ---
  const handleActionSuccess = useCallback((message) => {
    console.log("Action success:", message);
    setSuccessMessage(message);
    setShowSuccess(true);
    closeModal();
    fetchTypes(currentPageUrl);
    setTimeout(() => setShowSuccess(false), 3000);
  }, [currentPageUrl, fetchTypes, closeModal]);

  const handleDeleteType = useCallback(async (typeToDelete) => {
    if (!typeToDelete) return;
    console.log("Attempting to delete (deactivate - MINIMAL PAYLOAD) type:", typeToDelete.id);
    setIsDeleting(true);
    setDeleteError(null);
    setError(null);
    try {
      await updateType(typeToDelete.id, { status: false });
      handleActionSuccess(`Tipo "${typeToDelete.name}" eliminado.`);
    } catch (err) {
      console.error("Error deleting type:", err);
      setDeleteError(err.message || "Error al eliminar el tipo.");
    } finally {
      setIsDeleting(false);
    }
  }, [handleActionSuccess]);

  const handleCreateType = useCallback(async (newTypeData) => {
    console.log("Attempting to create type:", newTypeData);
    setError(null);
    try {
      const createdType = await createType(newTypeData);
      handleActionSuccess(`Tipo "${createdType.name}" creado exitosamente.`);
      return true;
    } catch (err) {
      console.error("Error creating type:", err);
      throw err;
    }
  }, [handleActionSuccess]);

  const handleUpdateType = useCallback(async (typeId, updatedData) => {
    console.log(`Attempting to update type ${typeId} with:`, updatedData);
    setError(null);
    try {
      await updateType(typeId, updatedData);
      handleActionSuccess(`Tipo "${updatedData.name}" actualizado.`);
      return true;
    } catch (err) {
      console.error("Error updating type:", err);
      throw err;
    }
  }, [handleActionSuccess]);

  // --- Filtering ---
  const handleFilterChange = useCallback((newFiltersFromComponent) => {
    console.log("Filter change received from component:", newFiltersFromComponent);
    setFilters((prevFilters) => ({ ...prevFilters, ...newFiltersFromComponent }));
  }, []);

  // --- Columnas y Opciones de Filtro ---
  const columns = useMemo(() => [
    { key: "name", label: "Tipo", filterable: true, filterType: "text" },
    { key: "category", label: "Categoría", filterable: true, filterType: "select" }
  ], []);

  const categoryOptionsForFilter = useMemo(() => {
    const options = [{ value: "", label: "Todas las Categorías" }];
    categories.forEach((cat) => {
      options.push({ value: cat.id.toString(), label: cat.name });
    });
    return options;
  }, [categories]);

  // --- Helper para mostrar nombre de categoría ---
  const memoizedCategoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  const getCategoryName = useCallback(
    (categoryId) => {
      const idToFind = typeof categoryId === "string" ? parseInt(categoryId, 10) : categoryId;
      if (loadingCategories) return "Cargando...";
      if (isNaN(idToFind)) return "CATEGORÍA INVÁLIDA";
      return memoizedCategoriesMap.get(idToFind) || "SIN CATEGORÍA";
    },
    [loadingCategories, memoizedCategoriesMap]
  );

  // --- Render Logic ---
  if (loading && types.length === 0 && isInitialMount) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }
  if (error && types.length === 0) {
    return (
      <Layout>
        <div className="px-4 py-4">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      </Layout>
    );
  }
  if (errorCategories && categories.length === 0) {
    return (
      <Layout>
        <div className="px-4 py-4">
          <ErrorMessage message={errorCategories} onClose={() => setErrorCategories(null)} />
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        {showSuccess && (
          <div className="fixed top-20 right-5 z-[10000]">
            <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
          </div>
        )}
        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar title="Lista de Tipos" onButtonClick={openCreateModal} buttonText="Nuevo Tipo" />
          <Filter
            columns={columns}
            onFilterChange={handleFilterChange}
            categoryOptions={categoryOptionsForFilter}
            loadingCategories={loadingCategories}
          />

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

          {/* Bloque de "no se encontraron tipos" sin botón, siguiendo el estilo de categorías */}
          {!loading && types.length === 0 && (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron tipos que coincidan con los filtros.</p>
            </div>
          )}

          {!loading && types.length > 0 && (
            <TypeTable
              types={types}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              openDeleteConfirmModal={openDeleteConfirmModal}
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
