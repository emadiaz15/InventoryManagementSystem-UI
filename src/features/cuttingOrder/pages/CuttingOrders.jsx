import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
// Si tienes un modal para crear órdenes, por ejemplo
// import CuttingOrderCreateModal from "../components/create/CuttingOrderCreateModal";
import { listCuttingOrders } from "../services/listCuttingOrders";
import { useAuth } from "../../../context/AuthProvider";

const CuttingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Definimos los encabezados de la tabla para Órdenes de Corte
  const headers = [
    "ID",
    "Cliente",
    "Producto",
    "Cantidad a Cortar",
    "Estado",
    "Acciones"
  ];

  // Función para cargar órdenes de corte de una página específica
  const fetchOrders = async (url = "/cutting/orders/") => {
    setLoadingOrders(true);
    try {
      const data = await listCuttingOrders(url);

      /**
       * Suponiendo que tu backend devuelve:
       * {
       *   results: [...],
       *   next: 'http://...',
       *   previous: 'http://...',
       *   count: 42
       * }
       *
       * Si tu backend no tiene esa paginación, ajusta este bloque.
       */
      if (data && Array.isArray(data.results)) {
        setOrders(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        // Ejemplo: cada página tiene 10 items => totalPages
        setTotalPages(Math.ceil(data.count / 10));
      }
      else if (Array.isArray(data)) {
        // Caso alternativo: si solo recibes array sin paginación
        setOrders(data);
      }
      else {
        setError(new Error("Formato de datos inválido en la respuesta de la API"));
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }
      fetchOrders();
    }
  }, [isAuthenticated, loading, navigate]);

  // Funciones para manejar la paginación
  const handleNextPage = () => {
    if (nextPage) {
      fetchOrders(nextPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchOrders(previousPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Muestra un mensaje de éxito y recarga la lista
  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchOrders();
  };

  // Lógica para crear orden (si tuvieras un modal)
  // const handleCreateOrder = () => {
  //   setShowCreateModal(true);
  // };

  // Lógica para búsqueda (placeholder)
  const handleSearch = (query) => {
    console.log("Buscar órdenes con el término:", query);
    // Aquí podrías filtrar localmente o llamar a la API con query param
  };

  // Lógica para editar / borrar (placeholder)
  const handleEdit = (order) => {
    console.log("Editar orden:", order);
  };

  const handleDelete = (orderId) => {
    console.log("Borrar orden:", orderId);
    // Luego llamas a tu servicio para borrar y actualizas la lista
    handleShowSuccess(`Orden #${orderId} eliminada con éxito`);
  };

  // Configuración de las filas para la tabla
  const rows = orders.map((order) => ({
    "ID": order.id,
    "Cliente": order.customer,
    "Producto": String(order.product), // O si tienes más datos del producto
    "Cantidad a Cortar": order.cutting_quantity,
    "Estado": order.status,
    "Acciones": (
      <div className="space-x-2">
        <button
          onClick={() => handleEdit(order)}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          aria-label="Editar orden"
        >
          Editar
        </button>
        <button
          onClick={() => handleDelete(order.id)}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          aria-label="Eliminar orden"
        >
          Borrar
        </button>
      </div>
    )
  }));

  if (error) {
    return <p className="p-6">Error cargando órdenes de corte: {error.message}</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col p-2 mt-14">
          {/* Toolbar con búsqueda y botón de creación (si aplica) */}
          <Toolbar
            onSearch={handleSearch}
            // onCreate={handleCreateOrder}
            createButtonText="Nueva Orden"
          />

          {/* Contenedor principal donde va la tabla */}
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            {loadingOrders ? (
              <p className="p-6">Cargando órdenes...</p>
            ) : (
              <Table headers={headers} rows={rows} />
            )}
          </div>

          {/* Paginación (si tu backend devuelve next/previous) */}
          <Pagination
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </div>

      <Footer />

      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* {showCreateModal && (
        <CuttingOrderCreateModal
          onClose={() => setShowCreateModal(false)}
          onSave={(newOrder) => {
            // Lógica para guardar la nueva orden y refrescar lista
            handleShowSuccess("¡Orden de corte creada con éxito!");
            setShowCreateModal(false);
          }}
        />
      )} */}
    </div>
  );
};

export default CuttingOrders;
