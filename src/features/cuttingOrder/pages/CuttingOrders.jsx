import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import Spinner from "../../../components/ui/Spinner";
import { listCuttingOrders } from "../services/listCuttingOrders";
import { useAuth } from "../../../context/AuthProvider";
import Layout from "../../../pages/Layout";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import OrderFilter from "../components/OrderFilter";

const CuttingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false); // ✅ Control inicial
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const headers = [
    "ID subproduct",
    "Tipo",
    "Medida",
    "Cliente",
    "Cantidad a cortar",
    "Nro de Pedido",
    "Asignado a",
    "Creado por",
    "Estado",
    "Acciones",
  ];

  const fetchOrders = async (baseUrl = "/cutting/cutting-orders/") => {
    setLoadingOrders(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      if (selectedDate) {
        queryParams.append("created_at", selectedDate);
      }

      const finalUrl = `${baseUrl}?${queryParams.toString()}`;
      const data = await listCuttingOrders(finalUrl);

      if (data && Array.isArray(data.results)) {
        setOrders(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setTotalPages(Math.ceil(data.count / 10));
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setError(new Error("Formato de datos inválido en la respuesta de la API"));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoadingOrders(false);
      setInitialLoaded(true); // ✅ Activar visibilidad de contenido
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

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchOrders();
  };

  const handleView = (order) => {
    console.log("Ver detalles de la orden:", order);
  };

  const handleEdit = (order) => {
    console.log("Editar orden:", order);
  };

  const handleDelete = (orderId) => {
    console.log("Borrar orden:", orderId);
    handleShowSuccess(`Orden #${orderId} eliminada con éxito`);
  };

  const rows = orders.map((order) => ({
    "ID subproduct": order.subproduct,
    Tipo: order.type || "Sin tipo",
    Medida: order.measure || "Sin medida",
    Cliente: order.customer || "Sin cliente",
    "Cantidad a cortar": order.cutting_quantity,
    "Nro de Pedido": order.id,
    "Asignado a": order.assigned_to || "Sin asignación",
    "Creado por": order.created_by || "N/A",
    Estado: order.status || "N/A",
    Acciones: (
      <div className="flex space-x-2">
        <button
          onClick={() => handleView(order)}
          className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
          aria-label="Ver detalles de la orden"
        >
          <EyeIcon className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleEdit(order)}
          className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
          aria-label="Editar orden"
        >
          <PencilIcon className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleDelete(order.id)}
          className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
          aria-label="Eliminar orden"
        >
          <TrashIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    ),
  }));

  // 🔒 Primera carga total → Spinner pantalla completa
  if (!initialLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background-100 text-text-primary">
        <Spinner size="10" />
      </div>
    );
  }

  return (
    <>
      <Layout>
        <div className="flex-1 flex flex-col p-1 mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <OrderFilter
              onFilterChange={(updatedFilters) => {
                setFilters(updatedFilters);
                fetchOrders();
              }}
              onDateChange={(date) => {
                setSelectedDate(date);
                fetchOrders();
              }}
            />
            <Toolbar
              onSearch={(query) => console.log("Buscar órdenes:", query)}
              buttonText="Crear Order de Corte"
            />
          </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <Table headers={headers} rows={rows} />
            )}
          </div>

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
    </>
  );
};

export default CuttingOrders;
