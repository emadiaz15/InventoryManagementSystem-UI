// src/features/product/pages/SubproductList.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import Layout from "@/pages/Layout";
import Toolbar from "@/components/common/Toolbar";
import SuccessMessage from "@/components/common/SuccessMessage";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";

import SubproductModals from "../components/SubproductModals";
import SubproductCard from "../components/SubproductCard";
import SubproductFilters from "../components/SubproductFilter";

import {
  useListSubproducts,
  useCreateSubproduct,
  useUpdateSubproduct,
  useDeleteSubproduct,
} from "@/features/product/hooks/useSubproductHooks";

const PAGE_SIZE = 15;

export default function SubproductList() {
  const { productId } = useParams();
  const pid = Number(productId);

  // — filtros y paginación
  const [filters, setFilters] = useState({ status: "true" });
  const [pageUrl, setPageUrl] = useState(null);

  // — modales
  const [modalState, setModalState] = useState({ type: null, subproductData: null });
  const openModal = useCallback((type, data = null) => {
    setModalState({ type, subproductData: data });
  }, []);
  const closeModal = useCallback(() => {
    setModalState({ type: null, subproductData: null });
  }, []);

  // — mensajes y delete
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = useCallback((msg) => {
    setPageUrl(null);
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }, []);

  // — Custom hook de React Query
  const {
    subproducts,
    nextPageUrl,
    previousPageUrl,
    isLoading,
    isError,
    error: fetchError,
  } = useListSubproducts(pid, pageUrl, filters);

  // — Mutations
  const createMutation = useCreateSubproduct(pid);
  const updateMutation = useUpdateSubproduct(pid);
  const deleteMutation = useDeleteSubproduct(pid);

  // — CRUD handlers
  const handleCreate = useCallback(
    async (formData) => {
      try {
        await createMutation.mutateAsync(formData);
        handleSave("Subproducto creado correctamente");
        closeModal();
      } catch (err) {
        console.error("Error creando subproducto:", err);
      }
    },
    [createMutation, handleSave, closeModal]
  );

  const handleUpdate = useCallback(
    async ({ id, formData }) => {
      try {
        await updateMutation.mutateAsync({ subproductId: id, formData });
        handleSave("Subproducto actualizado correctamente");
        closeModal();
      } catch (err) {
        console.error("Error actualizando subproducto:", err);
      }
    },
    [updateMutation, handleSave, closeModal]
  );

  const handleDelete = useCallback(
    async ({ id }) => {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        await deleteMutation.mutateAsync(id);
        handleSave("Subproducto eliminado correctamente");
        closeModal();
      } catch (err) {
        setDeleteError(err.message || "Error al eliminar subproducto");
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteMutation, handleSave, closeModal]
  );

  const handleCreateOrder = useCallback(() => {
    handleSave("Orden de corte creada correctamente");
    closeModal();
  }, [handleSave, closeModal]);

  // — Filtrar UI
  const onFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPageUrl(null);
  }, []);

  return (
    <Layout isLoading={loading}>
      {showSuccess && (
        <div className="fixed top-20 right-5 z-50">
          <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
        </div>
      )}

      <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
        <Toolbar
          title="Lista de Subproductos"
          buttonText="Crear Subproducto"
          onButtonClick={() => openModal("create")}
        />

        <SubproductFilters filters={filters} onChange={onFilterChange} />

        {isError && (
          <ErrorMessage message={fetchError?.message} onClose={() => { }} />
        )}

        {isLoading ? (
          <div className="my-8 flex justify-center items-center min-h-[30vh]">
            <Spinner size="6" color="text-primary-500" />
          </div>
        ) : subproducts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow mt-4">
            <p className="text-gray-500">
              No existen subproductos registrados para este producto.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {subproducts.map((sp) => (
              <SubproductCard
                key={sp.id}
                subproduct={sp}
                onAddToOrder={() => openModal("createOrder", sp)}
                onViewDetails={() => openModal("view", sp)}
                onViewStock={() => openModal("viewHistory", sp)}
                onEdit={() => openModal("edit", sp)}
                onDelete={() => openModal("deleteConfirm", sp)}
              />
            ))}
          </div>
        )}

        <Pagination
          onNext={nextPageUrl ? () => setPageUrl(nextPageUrl) : undefined}
          onPrevious={previousPageUrl ? () => setPageUrl(previousPageUrl) : undefined}
          hasNext={Boolean(nextPageUrl)}
          hasPrevious={Boolean(previousPageUrl)}
        />
      </div>

      <SubproductModals
        modalState={modalState}
        closeModal={closeModal}
        onCreateSubproduct={handleCreate}
        onUpdateSubproduct={handleUpdate}
        onDeleteSubproduct={handleDelete}
        onCreateOrder={handleCreateOrder}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={() => setDeleteError(null)}
        parentProduct={{ id: pid }}
      />
    </Layout>
  );
}
