import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Toolbar from "@/components/common/Toolbar";
import SuccessMessage from "@/components/common/SuccessMessage";
import ErrorMessage from "@/components/common/ErrorMessage";
import AdvancedFilter from "../components/AdvancedFilter";
import Layout from "@/pages/Layout";
import Spinner from "@/components/ui/Spinner";

import TypeTable from "../components/TypeTable";
import TypeModals from "../components/TypeModals";

import { useTypes } from "../hooks/useTypes";
import {
  useCreateType,
  useUpdateType,
  useDeleteType
} from "../hooks/useTypeMutations";

import { listCategories } from "@/features/category/services/categories";
import useEntityModal from "@/hooks/useEntityModal";
import useSuccess from "@/hooks/useSuccess";

const TypeList = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ name: "", category: "", page: 1, page_size: 10 });

  const {
    successMessage,
    error: actionError,
    handleSuccess,
    handleError,
    clear: clearStatus
  } = useSuccess();

  const {
    types,
    loading: loadingTypes,
    isError: typesError,
    error: typesErrorMsg,
    nextPageUrl,
    previousPageUrl
  } = useTypes(filters);

  const createTypeMut = useCreateType();
  const updateTypeMut = useUpdateType();
  const deleteTypeMut = useDeleteType();

  const {
    showCreateModal,
    showEditModal,
    showViewModal,
    showConfirmDialog,
    selectedEntity: selectedType,
    entityToDelete,
    openCreateModal,
    openEditModal,
    openViewModal,
    openConfirmDialog,
    handleDelete: handleDeleteModal,
    closeAllModals
  } = useEntityModal({
    onDelete: async (type) => {
      try {
        await deleteTypeMut.mutateAsync(type.id);
        handleSuccess(`Tipo "${type.name}" eliminado.`);
        setFilters((f) => ({ ...f, page: 1 }));
      } catch (err) {
        handleError(err);
      }
    }
  });

  const {
    data: catPage = { results: [] },
    isLoading: loadingCategories,
    isError: categoriesError,
    error: categoriesErrorMsg
  } = useQuery({
    queryKey: ["categories", { limit: 1000, status: true }],
    queryFn: () => listCategories({ limit: 1000, status: true }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  const categories = catPage.results;

  const filterColumns = useMemo(
    () => [
      { key: "name", label: "Tipo", filterType: "text" },
      {
        key: "category",
        label: "Categoría",
        filterType: "select",
        options: [
          { value: "", label: "Todas" },
          ...categories.map((c) => ({ value: c.id.toString(), label: c.name }))
        ]
      }
    ],
    [categories]
  );

  const getCategoryName = useCallback(
    (catId) => categories.find((c) => c.id === catId)?.name || "SIN CATEGORÍA",
    [categories]
  );

  const handleCreateType = async (payload) => {
    clearStatus();
    try {
      const created = await createTypeMut.mutateAsync(payload);
      handleSuccess(`Tipo "${created.name}" creado.`);
      setFilters((f) => ({ ...f, page: 1 }));
    } catch (err) {
      handleError(err);
    }
  };

  const handleUpdateType = async (id, payload) => {
    clearStatus();
    try {
      const updated = await updateTypeMut.mutateAsync({ id, payload });
      handleSuccess(`Tipo "${updated.name}" actualizado.`);
      setFilters((f) => ({ ...f, page: 1 }));
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <>
      <Layout isLoading={loadingTypes || loadingCategories}>
        {successMessage && (
          <div className="fixed top-20 right-5 z-50">
            <SuccessMessage message={successMessage} onClose={clearStatus} />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar
            title="Lista de Tipos"
            onBackClick={() => navigate("/product-list")}
            onButtonClick={openCreateModal}
            buttonText="Nuevo Tipo"
          />

          <AdvancedFilter
            columns={filterColumns}
            initialFilters={filters}
            onFilterChange={(newF) => setFilters((f) => ({ ...f, ...newF, page: 1 }))}
          />

          {(typesError || categoriesError) && (
            <ErrorMessage
              message={
                typesError
                  ? typesErrorMsg.message || "Error cargando tipos."
                  : categoriesErrorMsg.message || "Error cargando categorías."
              }
            />
          )}

          {loadingTypes ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : types.length > 0 ? (
            <TypeTable
              types={types}
              getCategoryName={getCategoryName}
              openViewModal={openViewModal}
              openEditModal={openEditModal}
              openDeleteConfirmModal={openConfirmDialog}
              goToNextPage={
                nextPageUrl ? () => setFilters((f) => ({ ...f, page: f.page + 1 })) : null
              }
              goToPreviousPage={
                previousPageUrl ? () => setFilters((f) => ({ ...f, page: f.page - 1 })) : null
              }
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          ) : (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron tipos.</p>
            </div>
          )}
        </div>
      </Layout>

      <TypeModals
        showCreateModal={showCreateModal}
        showEditModal={showEditModal}
        showViewModal={showViewModal}
        showConfirmDialog={showConfirmDialog}
        type={selectedType}
        typeToDelete={entityToDelete}
        onCreateType={handleCreateType}
        onUpdateType={handleUpdateType}
        onDeleteType={handleDeleteModal}
        closeAllModals={closeAllModals}
        categories={categories}
        loadingCategories={loadingCategories}
        getCategoryName={getCategoryName}
        error={actionError}
      />
    </>
  );
};

export default TypeList;
