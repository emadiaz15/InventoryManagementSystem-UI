import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import Modal from "../../../components/ui/Modal";
import TypeModal from "../components/TypeModal";
import { ButtonsActions } from "../../../components/ui/ButtonsActions";
import { listTypes } from "../services/listType";
import { updateType } from "../services/updateType";
import { useAuth } from "../../../hooks/useAuth";

const TypesList = () => {
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const headers = ["Categoría", "Nombre de Tipo", "Descripción", "Acciones"];

  const fetchTypes = async (url = "inventory/types/") => {
    setLoading(true);
    try {
      const data = await listTypes(url);
      setTypes(data.activeTypes || []);
      setNextPage(data.nextPage);
      setPreviousPage(data.previousPage);
    } catch (error) {
      setError(error.message || "Error al cargar los tipos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/");
        return;
      }
      fetchTypes();
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleNextPage = () => {
    if (nextPage) {
      fetchTypes(nextPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchTypes(previousPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchTypes();
  };

  const handleCreateType = () => {
    setSelectedType(null);
    setShowModal(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleToggleStatus = async (typeId, isActive) => {
    if (window.confirm(`¿Estás seguro de que deseas ${isActive ? "restaurar" : "eliminar"} este tipo?`)) {
      try {
        await updateType(typeId, { status: isActive });
        handleShowSuccess(`Tipo ${isActive ? "restaurado" : "eliminado"} correctamente.`);
      } catch (error) {
        setError("No se pudo cambiar el estado del tipo.");
      }
    }
  };

  const rows = Array.isArray(types)
    ? types.map((type) => ({
      "Categoría": type.category ? type.category.name : "Sin Categoría",
      "Nombre de Tipo": type.name || "Sin nombre",
      "Descripción": type.description || "Sin descripción",
      "Acciones": (
        <ButtonsActions
          onEdit={() => handleEditType(type)}
          onDelete={() => handleToggleStatus(type.id, false)}
        />
      ),
    }))
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col p-2 mt-14">
          <Toolbar onSearch={() => { }} onCreate={handleCreateType} createButtonText="Nuevo Tipo" />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            <Table headers={headers} rows={rows} />
          </div>
          <Pagination
            onNext={handleNextPage}
            onPrevious={handlePreviousPage}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </div>
      <Footer />
      {showSuccess && <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedType ? "Editar Tipo" : "Crear Tipo"}>
          <TypeModal
            type={selectedType}
            onClose={() => setShowModal(false)}
            onSave={() => handleShowSuccess(selectedType ? "Tipo editado correctamente." : "Tipo creado correctamente.")}
          />
        </Modal>
      )}
    </div>
  );
};

export default TypesList;
