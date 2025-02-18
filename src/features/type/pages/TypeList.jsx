import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import { listTypes } from "../services/listType";
import { updateType } from "../services/updateType";
import ButtonsActions from "../../../components/ui/ButtonsActions";
import Modal from "../../../components/ui/Modal";

const TypesList = () => {
  const [types, setTypes] = useState([]);  // Inicializamos como array vacío
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // Único estado para controlar el modal
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();

  // Cargar tipos
  const fetchTypes = async (url = "inventory/types/") => {
    setLoading(true);
    try {
      const data = await listTypes(url);
      setTypes(data.activeTypes || []);  // Aseguramos que siempre sea un array
      setNextPage(data.nextPage);
      setPreviousPage(data.previousPage);
    } catch (error) {
      setError(error.message || "Error al cargar los tipos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSearch = (query) => {
    console.log("Buscar tipos con el término:", query);
  };

  const handleCreateType = () => {
    setSelectedType(null); // Para crear un nuevo tipo
    setShowModal(true);
  };

  const handleEditType = (type) => {
    setSelectedType(type); // Para editar un tipo existente
    setShowModal(true);
  };

  const handleToggleStatus = async (typeId, isActive) => {
    if (window.confirm(`¿Estás seguro de que deseas ${isActive ? "restaurar" : "eliminar"} este tipo?`)) {
      try {
        await updateType(typeId, { status: isActive });
        fetchTypes();
        setSuccessMessage(`Tipo ${isActive ? "restaurado" : "eliminado"} correctamente.`);
        setShowSuccess(true);
      } catch (error) {
        setError("No se pudo cambiar el estado del tipo.");
      }
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchTypes(nextPage);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchTypes(previousPage);
      setCurrentPage(currentPage - 1);
    }
  };

  const headers = ["Categoría", "Nombre de Tipo", "Descripción", "Acciones"];

  // Verificamos que `types` siempre sea un array antes de usar `map`
  const rows = Array.isArray(types) ? types.map((type) => ({
    id: type.id,
    cells: [
      type.category ? type.category.name : "Sin Categoría", // Aseguramos que esta celda exista
      type.name || "Sin nombre", // Aseguramos que esta celda exista
      type.description || "Sin descripción", // Aseguramos que esta celda exista
      <ButtonsActions
        onEdit={() => handleEditType(type)}
        onDelete={() => handleToggleStatus(type.id, false)}
      />
    ]
  })) : [];


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col p-2 mt-14">
          <Toolbar
            onSearch={handleSearch}
            onCreate={handleCreateType}
            createButtonText="Nuevo Tipo"
            placeholder="Buscar Tipo"
          />
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

      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Modal de Crear/Editar Tipo */}
      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedType ? "Editar Tipo" : "Crear Tipo"}>
          <TypeModal
            type={selectedType}
            onClose={() => setShowModal(false)}
            onSave={() => {
              fetchTypes();
              setSuccessMessage(selectedType ? "Tipo editado correctamente." : "Tipo creado correctamente.");
              setShowSuccess(true);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TypesList;
