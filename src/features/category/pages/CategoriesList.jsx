import React, { useState, useEffect } from "react";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import CategoryCreateModal from "../components/CategoryCreateModal";
import CategoryEditModal from "../components/CategoryEditModal";
import CategoryViewModal from "../components/CategoryViewModal";
import { listCategories } from "../services/listCategory";
import { updateCategory } from "../services/updateCategory";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false); // <-- Agregado para mostrar el modal de vista
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Guardar la categoría a eliminar

  const headers = ["Nombre de Categoría", "Descripción", "Acciones"];

  // Obtener categorías activas con paginación
  const fetchCategories = async (url = "/inventory/categories/") => {
    setLoadingCategories(true);
    try {
      const response = await listCategories(url);
      setCategories(response.results);
      setNextPage(response.next);
      setPreviousPage(response.previous);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      setError("Error al obtener las categorías.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Funciones de paginación
  const handleNextPage = () => {
    if (nextPage) {
      fetchCategories(nextPage);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchCategories(previousPage);
      setCurrentPage(currentPage - 1);
    }
  };

  // Función de éxito para mostrar mensajes
  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchCategories();
  };

  // Mostrar el modal de eliminación
  const handleToggleStatus = (category) => {
    setCategoryToDelete(category);
    setShowConfirmDialog(true);
  };

  // Confirmar eliminación: enviar todos los campos obligatorios, cambiando status a false
  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const dataToSend = {
          name: categoryToDelete.name,
          description: categoryToDelete.description,
          status: false,
        };
        await updateCategory(categoryToDelete.id, dataToSend);
        fetchCategories();
        setShowConfirmDialog(false);
        handleShowSuccess("Categoría eliminada correctamente.");
      } catch (error) {
        setError("Error al cambiar el estado de la categoría.");
      }
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  // Crear filas para la tabla con datos en mayúsculas y prevenir valores nulos
  const rows = categories.map((category) => ({
    "Nombre de Categoría": (category.name || "").toUpperCase(),
    "Descripción": (category.description || "Sin descripción").toUpperCase(),
    "Acciones": (
      <div className="flex space-x-2">
        <button
          onClick={() => {
            setSelectedCategory(category);
            setShowViewModal(true); // Mostrar modal de vista
          }}
          className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
          aria-label="Ver detalles"
        >
          <EyeIcon className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => {
            setSelectedCategory(category);
            setShowEditModal(true);
          }}
          className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
          aria-label="Editar categoría"
        >
          <PencilIcon className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => handleToggleStatus(category)}
          className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
          aria-label="Eliminar categoría"
        >
          <TrashIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    ),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div className="w-64">
          <Sidebar />
        </div>
        <div className="flex-1 mt-14 rounded-lg">
          <div className="p-2 border-gray-200 rounded-lg dark:border-gray-700">
            <Toolbar
              title="Lista de Categorías"
              onButtonClick={() => setShowCreateModal(true)}
              buttonText="Crear Categoría"
            />
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : loadingCategories ? (
              <p>Cargando...</p>
            ) : (
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
                <Table headers={headers} rows={rows} />
              </div>
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

      {showCreateModal && (
        <CategoryCreateModal onClose={() => setShowCreateModal(false)} />
      )}
      {showEditModal && selectedCategory && (
        <CategoryEditModal
          category={selectedCategory}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={async (id, updatedData) => {
            await updateCategory(id, updatedData);
            handleShowSuccess("Categoría actualizada correctamente.");
            setShowEditModal(false);
          }}
          onDelete={handleToggleStatus} // Al presionar eliminar en el EditModal se llamará a handleToggleStatus
        />
      )}

      {showViewModal && selectedCategory && (  // <-- Renderizado del modal de vista
        <CategoryViewModal
          category={selectedCategory}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showSuccess && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* Modal de confirmación */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white p-6 rounded shadow-lg transition-all">
            <h3 className="text-lg font-semibold text-text-primary">
              ¿Estás seguro de que deseas eliminar esta categoría?
            </h3>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-warning-500 text-white rounded-lg hover:bg-warning-600 transition-colors"
                onClick={cancelDelete}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-error-600 transition-colors"
                onClick={confirmDelete}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CategoryList;
