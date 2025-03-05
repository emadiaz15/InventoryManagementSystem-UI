import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { listSubproducts } from "../services/listSubproducts";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import SubproductFormModal from "../components/SubproductFormModal";
import Card from "../../../components/cards/Card"; // Componente de tarjetas

const SubproductList = () => {
  const { productId } = useParams();
  const [subproducts, setSubproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!productId) {
      setError("ID de producto no válido.");
      setLoading(false);
      return;
    }
    fetchSubproducts();
  }, [productId]);

  const fetchSubproducts = async (url = null) => {
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
    <div className="flex flex-col min-h-screen bg-background-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 mt-14 p-4 ml-64">
          {loading ? (
            <div className="text-center">Cargando subproductos...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : subproducts.length === 0 ? (
            <div className="text-center text-gray-500">No hay subproductos disponibles.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-4">
              {subproducts.map((subproduct) => (
                <Card
                  key={subproduct.id}
                  imageUrl={subproduct.image || "/placeholder.png"}
                  title={subproduct.name}
                  stock={subproduct.stock ?? "No disponible"}
                  onAddToCart={() => console.log(`Agregado ${subproduct.name} al carrito`)}
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
      </div>
      {showSuccess && <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />}
      {showModal && (
        <SubproductFormModal
          parentProduct={{ id: productId }}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={() => handleShowSuccess("Subproducto guardado correctamente.")}
        />
      )}
      <Footer />
    </div>
  );
};

export default SubproductList;
