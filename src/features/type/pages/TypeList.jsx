import React, { useState, useEffect } from "react";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import TypeCreateModal from "../components/TypeCreateModal";
import TypeEditModal from "../components/TypeEditModal";
import TypeViewModal from "../components/TypeViewModal";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { listTypes } from "../services/listType";
import { updateType } from "../services/updateType";
import { useAuth } from "../../../context/AuthProvider";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { listCategories } from "../../category/services/listCategory";
import Layout from "../../../pages/Layout";

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [typeToDelete, setTypeToDelete] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

  // Abrir modal para ver detalles de un tipo
  const handleViewType = (type) => {
    setSelectedType(type);
    setShowViewModal(true);
  };

  // Mostrar confirmación antes de eliminar un tipo
  const handleToggleStatus = (type) => {
    setTypeToDelete(type);
    setShowConfirmDialog(true);
  };

  // Confirmar eliminación/restauración de un tipo
  const handleDeleteType = async () => {
    if (typeToDelete) {
      try {
        // Se envía la actualización del status a false para eliminar lógicamente el tipo
        await updateType(typeToDelete.id, { status: false });
        fetchTypes();
        handleShowSuccess("Tipo eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar el tipo:", error.response?.data || error.message);
        setError("No se pudo eliminar el tipo.");
      } finally {
        setTypeToDelete(null);
        setShowConfirmDialog(false);
      }
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setTypeToDelete(null);
    setShowConfirmDialog(false);
  };

  // Obtener categorías para mostrar su nombre
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        setCategories(data.results || []);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // Función para obtener el nombre de la categoría en mayúsculas
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name.toUpperCase() : "SIN CATEGORÍA";
  };

  // Crear filas para la tabla asegurando que todos los datos sean cadenas y se conviertan a mayúsculas
  const rows = types.map((type) => ({
    "Categoría": getCategoryName(type.category),
    "Nombre de Tipo": (type.name || "SIN NOMBRE").toUpperCase(),
    "Descripción": (type.description || "SIN DESCRIPCIÓN").toUpperCase(),
    "Acciones": (
      <div className="flex space-x-2">
        {/* Botón para ver detalles */}
        <button
          onClick={() => handleViewType(type)}
          className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
          aria-label="Ver detalles"
        >
          <EyeIcon className="w-5 h-5 text-white" />
        </button>

        {/* Botón para editar */}
        <button
          onClick={() => handleEditType(type)}
          className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
          aria-label="Editar tipo"
        >
          <PencilIcon className="w-5 h-5 text-text-white" />
        </button>

        {/* Botón para eliminar */}
        <button
          onClick={() => handleToggleStatus(type)}
          className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
          aria-label="Eliminar tipo"
        >
          <TrashIcon className="w-5 h-5 text-text-white" />
        </button>
      </div>
    ),
  }));

  return (
    <>
      <Layout>
        <div className="flex-1 flex flex-col p-2 mt-14">
          <Toolbar
            title="Lista de Tipos"
            onButtonClick={handleCreateType}
            buttonText="Crear Tipo"
          />
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            {loading ? (
              <p className="p-6">Cargando tipos...</p>
            ) : error ? (
              <p className="p-6 text-red-500">{error}</p>
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
          onDelete={handleDeleteType}
        />
      )}

      {showViewModal && selectedType && (
        <TypeViewModal
          type={selectedType}
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas eliminar este tipo?"
          onConfirm={handleDeleteType}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
};

export default TypesList;
