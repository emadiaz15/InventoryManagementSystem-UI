import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import SubproductFormModal from "../components/SubproductFormModal";
import SubproductCard from "../components/SubproductCard";
import { listSubproducts } from "../services/listSubproducts";
import Layout from "../../../pages/Layout";

const SubproductList = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [subproducts, setSubproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSubproducts = async (url = `/inventory/products/${productId}/subproducts/`) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listSubproducts(productId, url);
      if (data?.results) {
        setSubproducts(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else {
        setSubproducts([]);
        setError("No hay subproductos disponibles.");
      }
    } catch (error) {
      setError("Error al cargar los subproductos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchSubproducts();
    } else {
      setError("ID de producto no válido.");
      setLoading(false);
    }
  }, [productId]);

  const handleNextPage = () => {
    if (nextPage) fetchSubproducts(nextPage);
  };

  const handlePreviousPage = () => {
    if (previousPage) fetchSubproducts(previousPage);
  };

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchSubproducts();
  };

  return (
    <>
      <Layout>
        <div className="flex-1 p-4 mt-14">
          <Toolbar
            title="Subproductos"
            extraButtons={
              <button
                onClick={() => navigate(`/products/${productId}/create-subproduct`)}
                className="ml-2 text-white bg-secondary-500 hover:bg-secondary-600 px-4 py-2 rounded"
              >
                Crear Subproducto
              </button>
            }
          />
          {loading ? (
            <p className="text-center">Cargando subproductos...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : subproducts.length === 0 ? (
            <p className="text-center text-gray-500">No hay subproductos disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
              {subproducts.map((subproduct) => (
                <SubproductCard
                  key={subproduct.id}
                  subproduct={subproduct}
                  onAddToOrder={() => console.log(`Agregado ${subproduct.name} al carrito`)}
                  onEdit={() => console.log("Editar subproducto", subproduct)}
                  onDelete={() => console.log("Eliminar subproducto", subproduct)}
                  onViewDetails={() => console.log("Ver detalles", subproduct)}
                  onViewStock={() => navigate(`/subproducts/${subproduct.id}/stock-history`)}
                />
              ))}
            </div>
          )}
          <Pagination
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </Layout>

      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}
      {showModal && (
        <SubproductFormModal
          parentProduct={{ id: productId }}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => handleShowSuccess("Subproducto guardado correctamente.")}
        />
      )}
    </>
  );
};

export default SubproductList;
