import React, { useState, useMemo, useCallback } from "react";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Filter from "../../../components/ui/Filter";
import Layout from "../../../pages/Layout";
import Spinner from "../../../components/ui/Spinner";
import TypeTable from "../components/TypeTable";
import TypeModals from "../components/TypeModals";
import { useTypesQuery } from "../queries/useTypesQuery";
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "../../category/services/listCategory";
import useTypeModal from "../hooks/useTypeModal";
import { buildQueryString } from "@/utils/queryUtils";

const TypeList = () => {
  const [filters, setFilters] = useState({ name: "", category: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const { modalState, openModal, closeModal } = useTypeModal();

  const {
    types,
    loadingTypes,
    error,
    nextPageUrl,
    previousPageUrl,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useTypesQuery(filters);

  const {
    data: categories,
    isLoading: loadingCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () =>
      listCategories("/inventory/categories/?limit=1000&status=true").then(
        (res) => res.results
      ),
    staleTime: 1000 * 60 * 5,
  });

  const handleActionSuccess = (msg) => {
    setSuccessMessage(msg);
    closeModal();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCreateType = async (newTypeData) => {
    try {
      await createMutation.mutateAsync(newTypeData);
      handleActionSuccess(`Tipo "${newTypeData.name}" creado exitosamente.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateType = async (typeId, updatedData) => {
    try {
      await updateMutation.mutateAsync({ id: typeId, ...updatedData });
      handleActionSuccess(`Tipo "${updatedData.name}" actualizado.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteType = async (typeToDelete) => {
    try {
      await deleteMutation.mutateAsync(typeToDelete.id);
      handleActionSuccess(`Tipo "${typeToDelete.name}" eliminado.`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const categoryOptionsForFilter = useMemo(() => {
    if (!categories) return [{ value: "", label: "Todas las Categorías" }];
    return [
      { value: "", label: "Todas las Categorías" },
      ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
    ];
  }, [categories]);

  const columns = useMemo(
    () => [
      { key: "name", label: "Tipo", filterable: true, type: "text" },
      {
        key: "category",
        label: "Categoría",
        filterable: true,
        type: "select",
        options: categoryOptionsForFilter,
      },
    ],
    [categoryOptionsForFilter]
  );

  const getCategoryName = useCallback(
    (categoryId) => {
      if (loadingCategories) return "Cargando...";
      return (
        categories?.find((cat) => cat.id === categoryId)?.name || "SIN CATEGORÍA"
      );
    },
    [categories, loadingCategories]
  );

  return (
    <>
      <Layout>
        {successMessage && (
          <div className="fixed top-20 right-5 z-[10000]">
            <SuccessMessage message={successMessage} onClose={() => setSuccessMessage("")} />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          <Toolbar title="Lista de Tipos" onButtonClick={() => openModal("create")} buttonText="Nuevo Tipo" />

          <Filter columns={columns} onFilterChange={handleFilterChange} initialFilters={filters} />

          {error && (
            <div className="my-4">
              <ErrorMessage message={error.message || "Error al cargar los tipos."} />
            </div>
          )}

          {loadingTypes ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : types.length > 0 ? (
            <TypeTable
              types={types}
              openViewModal={(data) => openModal("view", data)}
              openEditModal={(data) => openModal("edit", data)}
              openDeleteConfirmModal={(data) => openModal("deleteConfirm", data)}
              getCategoryName={getCategoryName}
            />
          ) : (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron tipos que coincidan con los filtros.</p>
            </div>
          )}
        </div>
      </Layout>

      <TypeModals
        modalState={modalState}
        closeModal={closeModal}
        onCreateType={handleCreateType}
        onUpdateType={handleUpdateType}
        onDeleteType={handleDeleteType}
        categories={categories || []}
        loadingCategories={loadingCategories}
        getCategoryName={getCategoryName}
      />
    </>
  );
};

export default TypeList;
