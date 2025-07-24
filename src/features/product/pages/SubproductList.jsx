import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../pages/Layout";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Spinner from "../../../components/ui/Spinner";
import Pagination from "../../../components/ui/Pagination";

import SubproductModals from "../components/SubproductModals";
import SubproductCard from "../components/SubproductCard";
import SubproductFilters from "../components/SubproductFilter";

// all CRUD in one file
import {
  listSubproducts,
  createSubproduct,
  updateSubproduct,
  deleteSubproduct,
} from "../services/subproducts/subproducts";

const PAGE_SIZE = 15;

// build a query string from filters
const buildQueryString = (filtersObj) => {
  const params = new URLSearchParams();
  Object.entries(filtersObj).forEach(([key, value]) => {
    if (value !== "") {
      params.append(key, value);
    }
  });
  return params.toString() ? `?${params.toString()}` : "";
};

const SubproductList = () => {
  const { productId } = useParams();

  const [subproducts, setSubproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [modalState, setModalState] = useState({
    type: null,
    subproductData: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // default status filter = "true"
  const [filters, setFilters] = useState({ status: "true" });

  const fetchSubproducts = useCallback(
    async (url = null) => {
      setLoading(true);
      setError(null);
      try {
        const query = buildQueryString({ ...filters, page_size: PAGE_SIZE });
        const baseUrl = `/inventory/products/${productId}/subproducts/`;
        const fullUrl = url || `${baseUrl}${query}`;
        const data = await listSubproducts(productId, fullUrl);
        setSubproducts(data.results || []);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } catch {
        setError("Error al obtener los subproductos.");
      } finally {
        setLoading(false);
      }
    },
    [productId, filters]
  );

  useEffect(() => {
    if (productId) fetchSubproducts();
  }, [productId, fetchSubproducts]);

  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    fetchSubproducts();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const clearDeleteError = () => setDeleteError(null);
  const handleCloseModal = () => {
    setModalState({ type: null, subproductData: null });
    clearDeleteError();
  };

  const handleCreate = async (formData) => {
    try {
      await createSubproduct(productId, formData);
      handleShowSuccess("Creado correctamente");
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async ({ id, ...rest }) => {
    try {
      await updateSubproduct(productId, id, rest);
      handleShowSuccess("Actualizado correctamente");
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async ({ id }) => {
    setIsDeleting(true);
    try {
      await deleteSubproduct(productId, id);
      handleShowSuccess("Eliminado correctamente");
      handleCloseModal();
    } catch (err) {
      setDeleteError(err.response?.data?.detail || err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateOrder = () => {
    handleShowSuccess("Orden de corte creada correctamente");
    handleCloseModal();
  };

  return (
    <Layout isLoading={loading}>
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
          title="Lista de Subproductos"
          buttonText="Crear Subproducto"
          onButtonClick={() =>
            setModalState({ type: "create", subproductData: null })
          }
        />

        <SubproductFilters filters={filters} onChange={setFilters} />

        {error && !loading && (
          <ErrorMessage message={error} onClose={() => setError(null)} />
        )}

        {loading ? (
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
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-2">
            {subproducts.map((sp) => (
              <SubproductCard
                key={sp.id}
                subproduct={sp}
                onAddToOrder={() =>
                  setModalState({ type: "createOrder", subproductData: sp })
                }
                onViewDetails={() =>
                  setModalState({ type: "view", subproductData: sp })
                }
                onViewStock={() =>
                  setModalState({ type: "viewHistory", subproductData: sp })
                }
                onEdit={() =>
                  setModalState({ type: "edit", subproductData: sp })
                }
                onDelete={() =>
                  setModalState({ type: "deleteConfirm", subproductData: sp })
                }
              />
            ))}
          </div>
        )}

        <Pagination
          onNext={() => nextPage && fetchSubproducts(nextPage)}
          onPrevious={() => previousPage && fetchSubproducts(previousPage)}
          hasNext={Boolean(nextPage)}
          hasPrevious={Boolean(previousPage)}
        />
      </div>

      <SubproductModals
        modalState={modalState}
        closeModal={handleCloseModal}
        onCreateSubproduct={handleCreate}
        onUpdateSubproduct={handleUpdate}
        onDeleteSubproduct={handleDelete}
        onCreateOrder={handleCreateOrder}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={clearDeleteError}
        parentProduct={{ id: Number(productId) }}
      />
    </Layout>
  );
};

export default SubproductList;
