import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listSubproducts } from '../services/listSubproducts';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import Table from '../../../components/common/Table';
import Pagination from '../../../components/ui/Pagination';
import SuccessMessage from '../../../components/common/SuccessMessage';
import SubproductFormModal from '../components/SubproductFormModal';

const SubproductList = () => {
  const { productId } = useParams();
  const [subproducts, setSubproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSubproducts = async (url) => {
    setLoading(true);
    try {
      const data = await listSubprod(productId, url);
      setSubproducts(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } catch (error) {
      setError('Error al cargar los subproductos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubproducts();
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

  const headers = ['Nombre', 'Código', 'Descripción', 'Acciones'];
  const rows = subproducts.map(subproduct => ({
    Nombre: subproduct.name,
    Código: subproduct.code,
    Descripción: subproduct.description,
    Acciones: (
      <button
        onClick={() => setShowModal(true)}
        className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
      >
        Editar
      </button>
    ),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 p-2">
          {loading ? (
            <div className="text-center">Cargando subproductos...</div>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <Table headers={headers} rows={rows} />
            </div>
          )}
          {error && <div className="text-red-500">{error}</div>}
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
          onSave={() => handleShowSuccess('Subproducto guardado correctamente.')}
        />
      )}
      <Footer />
    </div>
  );
};

export default SubproductList;
