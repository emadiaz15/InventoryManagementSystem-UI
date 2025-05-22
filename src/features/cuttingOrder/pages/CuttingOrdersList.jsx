import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import Spinner from "../../../components/ui/Spinner";
import { listCuttingOrders } from "../services/listCuttingOrders";
import { createCuttingOrder } from "../services/createCuttingOrder";
import { updateCuttingOrder } from "../services/updateCuttingOrder";
import { deleteCuttingOrder } from "../services/deleteCuttingOrder";
import { useAuth } from "../../../context/AuthProvider";
import Layout from "../../../pages/Layout";
import OrderFilter from "../components/OrderFilter";
import CuttingOrderTable from "../components/CuttingOrderTable";
import CuttingOrderModals from "../components/CuttingOrderModals";

const CuttingOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // modal state & deletion state
  const [modalState, setModalState] = useState({ type: null, orderData: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const fetchOrders = async (baseUrl = "/cutting/cutting-orders/") => {
    setLoadingOrders(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.append(k, v));
    if (selectedDate) params.append("created_at", selectedDate);
    const url = `${baseUrl}?${params.toString()}`;

    try {
      const data = await listCuttingOrders(url);
      if (data?.results) {
        setOrders(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } else if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (e) {
      console.error("Error fetching orders", e);
    } finally {
      setLoadingOrders(false);
      setInitialLoaded(true);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) return navigate("/");
      fetchOrders();
    }
  }, [isAuthenticated, loading, navigate, filters, selectedDate]);

  const handleNextPage = () => nextPage && fetchOrders(nextPage);
  const handlePreviousPage = () => previousPage && fetchOrders(previousPage);

  const handleShowSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    fetchOrders();
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Modal action handlers
  const handleCreateOrder = async (payload) => {
    try {
      await createCuttingOrder(payload);
      handleShowSuccess("Orden creada correctamente");
    } catch (e) {
      console.error(e);
    } finally {
      setModalState({ type: null, orderData: null });
    }
  };

  const handleUpdateOrder = async (payload) => {
    try {
      await updateCuttingOrder(payload.id, payload);
      handleShowSuccess(`Orden #${payload.id} actualizada`);
    } catch (e) {
      console.error(e);
    } finally {
      setModalState({ type: null, orderData: null });
    }
  };

  const handleDeleteOrder = async (id) => {
    setIsDeleting(true);
    try {
      await deleteCuttingOrder(id);
      handleShowSuccess(`Orden #${id} eliminada con éxito`);
    } catch (e) {
      setDeleteError(e.response?.data?.detail || e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const clearDeleteError = () => setDeleteError(null);

  // table action openers
  const openView = (order) =>
    setModalState({ type: "view", orderData: order });
  const openEdit = (order) =>
    setModalState({ type: "edit", orderData: order });
  const openDeleteConfirm = (order) =>
    setModalState({ type: "deleteConfirm", orderData: order });

  return (
    <Layout isLoading={!initialLoaded}>
      <div className="flex flex-col p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <OrderFilter
            onFilterChange={(f) => setFilters(f)}
            onDateChange={(d) => setSelectedDate(d)}
          />
          <Toolbar
            title="Órdenes de Corte"
            buttonText="Crear Orden de Corte"
            onButtonClick={() => setModalState({ type: "create", orderData: null })}
          />
        </div>

        {!initialLoaded ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="8" color="text-primary-500" />
          </div>
        ) : (
          <>
            <CuttingOrderTable
              orders={orders}
              onView={openView}
              onEdit={openEdit}
              onDelete={openDeleteConfirm}
            />
            <Pagination
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              hasNext={Boolean(nextPage)}
              hasPrevious={Boolean(previousPage)}
            />
          </>
        )}

        {showSuccess && (
          <SuccessMessage
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>

      <CuttingOrderModals
        modalState={modalState}
        closeModal={() => setModalState({ type: null, orderData: null })}
        onCreateOrder={handleCreateOrder}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
        isDeleting={isDeleting}
        deleteError={deleteError}
        clearDeleteError={clearDeleteError}
      />
    </Layout>
  );
};

export default CuttingOrdersList;
