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
import { listCategories } from "../services/listCategory";
import { updateCategory } from "../services/updateCategory"; // Solo usar este servicio
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { PencilIcon } from "@heroicons/react/24/outline";

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Guardar la categoría a eliminar

  const headers = ["Nombre de Categoría", "Descripción", "Acciones"];

  // Obtener categorías activas con paginación
  const fetchCategories = async (url = "/inventory/categories/") => {
    setLoadingCategories(true);
    try {
      const response = await listCategories(url); // Hacer la solicitud GET con paginación
      setCategories(response.results); // Establecer las categorías en el estado
      setNextPage(response.next);
      setPreviousPage(response.previous);
      setTotalPages(Math.ceil(response.count / 10)); // Asumiendo que la respuesta incluye un campo 'count' con el total
    } catch (error) {
      setError("Error al obtener las categorías.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); // Solo ejecutamos la carga inicial de categorías

  // Funciones de paginación
  const handleNextPage = () => {
    if (nextPage) {
      fetchCategories(nextPage); // Llamamos a la siguiente página
      setCurrentPage(currentPage + 1); // Actualizamos la página actual
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchCategories(previousPage); // Llamamos a la página anterior
      setCurrentPage(currentPage - 1); // Actualizamos la página actual
    }
  };

  // Función de éxito para mostrar mensajes
  const handleShowSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    fetchCategories(); // Recargar la lista después de cualquier acción
  };

  // Función de búsqueda
  const handleSearch = (query) => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setCategories(filtered);
  };

  // Mostrar el modal de eliminación
  const handleToggleStatus = (category) => {
    setCategoryToDelete(category);
    setShowConfirmDialog(true); // Mostrar confirmación de eliminación
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        // Cambiar el status de la categoría a false (simulando la eliminación)
        await updateCategory(categoryToDelete.id, { status: false });
        setShowConfirmDialog(false);
        fetchCategories(); // Recargar la lista después de la eliminación
        handleShowSuccess("Categoría eliminada correctamente.");
      } catch (error) {
        setError("Error al cambiar el estado de la categoría.");
      }
    }
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setShowConfirmDialog(false); // Cerrar ConfirmDialog si se cancela la eliminación
  };

  // Crear filas para la tabla
  const rows = categories.map((category) => ({
    "Nombre de Categoría": category.name,
    "Descripción": category.description,
    "Acciones": (
      <button
        onClick={() => {
          setSelectedCategory(category);
          setShowEditModal(true);
        }}
        className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
        aria-label="Editar categoría"
      >
        <PencilIcon className="w-5 h-5 text-text-white" />
      </button>
    )
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

      {showCreateModal && <CategoryCreateModal onClose={() => setShowCreateModal(false)} />}
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
        />
      )}

      {showSuccess && <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />}

      {showConfirmDialog && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas eliminar esta categoría?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      <Footer />
    </div>
  );
};

export default CategoryList;
