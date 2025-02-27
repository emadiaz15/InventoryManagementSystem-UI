import React, { useState, useEffect } from "react";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import TypeCreateModal from "../components/TypeCreateModal";
import TypeEditModal from "../components/TypeEditModal"; // Importa el modal de edición
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { listTypes } from "../services/listType";
import { updateType } from "../services/updateType";
import { useAuth } from '../../../context/AuthProvider';
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const TypesList = () => {
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const headers = ["Categoría", "Nombre de Tipo", "Descripción", "Acciones"];

  // Obtener tipos activos con paginación
  const fetchTypes = async (url = "/inventory/types/") => {
    setLoading(true);
    try {
      const data = await listTypes(url);
      setTypes(data.activeTypes || []);
      setNextPage(data.nextPage);
      setPreviousPage(data.previousPage);
    } catch (error) {
      setError("Error al cargar los tipos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchTypes();
    }
  }, [isAuthenticated, authLoading]);

  // Funciones de paginación
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

  // Mostrar mensaje de éxito
  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchTypes();
  };

  // Abrir modal para crear nuevo tipo
  const handleCreateType = () => {
    setSelectedType(null);
    setShowCreateModal(true);
  };

  // Abrir modal para editar tipo
  const handleEditType = (type) => {
    setSelectedType(type);
    setShowEditModal(true);
  };

  // Mostrar confirmación antes de cambiar el estado de un tipo
  const handleToggleStatus = (type) => {
    setTypeToDelete(type);
    setShowConfirmDialog(true);
  };

  // Confirmar eliminación/restauración de un tipo
  const confirmDelete = async () => {
    if (typeToDelete) {
      try {
        // Enviar solo el campo `status`
        await updateType(typeToDelete.id, { status: false });

        fetchTypes();
        setShowConfirmDialog(false);
        setShowEditModal(false); // Cerrar modal de edición si está abierto
        handleShowSuccess("Tipo eliminado correctamente.");
      } catch (error) {
        setError("Error al cambiar el estado del tipo.");
      }
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  // Crear filas para la tabla
  const rows = types.map((type) => ({
    "Categoría": type.category ? type.category.name : "Sin Categoría",  // Asegurar que muestra el nombre
    "Nombre de Tipo": type.name || "Sin nombre",
    "Descripción": type.description || "Sin descripción",
    "Acciones": (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditType(type)}
          className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
          aria-label="Editar tipo"
        >
          <PencilIcon className="w-5 h-5 text-text-white" />
        </button>
      </div>
    ),
  }));


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col p-2 mt-14">
          <Toolbar
            title="Lista de Tipos"
            onButtonClick={handleCreateType}
            buttonText="Crear Tipo"
          />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            {loading ? (
              <p className="p-6">Cargando tipos...</p>
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
      </div>
      <Footer />

      {showSuccess && (
        <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />
      )}

      {showCreateModal && (
        <TypeCreateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={() => handleShowSuccess("Tipo creado correctamente.")}
        />
      )}

      {showEditModal && selectedType && (
        <TypeEditModal
          type={selectedType}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={() => handleShowSuccess("Tipo editado correctamente.")}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas eliminar este tipo?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default TypesList;
