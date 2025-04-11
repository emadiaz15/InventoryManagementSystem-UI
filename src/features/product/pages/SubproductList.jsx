import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../pages/Layout";
import Toolbar from "../../../components/common/Toolbar";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Spinner from "../../../components/ui/Spinner";
import Pagination from "../../../components/ui/Pagination";
import { listSubproducts } from "../services/listSubproducts";
import SubproductModals from "../components/SubproductModals"; // 🆕 Centraliza los modales

const SubproductList = () => {
  const { productId } = useParams();

  const [subproducts, setSubproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [modalState, setModalState] = useState({ type: null, subproductData: null });

  const fetchSubproducts = async (url = `/inventory/products/${productId}/subproducts/`) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSubproducts(productId, url);
      setSubproducts(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (err) {
      setError("Error al obtener los subproductos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchSubproducts();
    }
  }, [productId]);

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchSubproducts();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCloseModal = () => {
    setModalState({ type: null, subproductData: null });
  };

  return (
    <Layout>
      {showSuccess && (
        <div className="fixed top-20 right-5 z-[10000]">
          <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
        </div>
      )}

      <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
        <Toolbar
          title="Lista de Subproductos"
          buttonText="Crear Subproducto ( Cables )"
          onButtonClick={() => setModalState({ type: "create", subproductData: null })}
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

        {!loading && subproducts.length === 0 && (
          <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
            <p className="text-gray-500">No existen subproductos registrados para este producto.</p>
          </div>
        )}

        {!loading && subproducts.length > 0 && (
          <div className="text-center py-10 px-4 mt-4 bg-yellow-100 border border-yellow-300 rounded">
            <p className="text-gray-700">Aquí se mostrará la tabla de subproductos.</p>
          </div>
        )}

        <Pagination
          onNext={() => nextPage && fetchSubproducts(nextPage)}
          onPrevious={() => previousPage && fetchSubproducts(previousPage)}
          hasNext={Boolean(nextPage)}
          hasPrevious={Boolean(previousPage)}
        />
      </div>

      {/* 🆕 Contenedor de modales */}
      <SubproductModals
        modalState={modalState}
        closeModal={handleCloseModal}
        onCreateSubproduct={() => handleShowSuccess("Subproducto creado exitosamente.")}
        onUpdateSubproduct={() => handleShowSuccess("Subproducto actualizado exitosamente.")}
        onDeleteSubproduct={() => handleShowSuccess("Subproducto eliminado exitosamente.")}
        isDeleting={false}
        deleteError={null}
        clearDeleteError={() => { }}
        parentProduct={{ id: productId }} // ✅ Esto es lo correcto
      />
    </Layout>
  );
};

export default SubproductList;
