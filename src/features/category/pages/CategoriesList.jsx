import React, { useState, useEffect } from 'react';
import { listCategories } from '../services/listCategory';
import { updateCategory } from '../services/updateCategory';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import CategoryToolbar from '../components/CategoryToolbar';
import CategoryCreateModal from '../components/CategoryCreateModal';
import CategoryEditModal from '../components/CategoryEditModal';
import SuccessMessage from '../../../components/common/SuccessMessage';
import Pagination from '../../../components/ui/Pagination';
import Table from "../../../components/common/Table"; // Importamos la tabla común
import { ButtonsActions } from "../../../components/ui/ButtonsActions"; // Si no tienes este componente, puedes crear uno para los botones de acción

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchCategories = async (url = "/inventory/categories/") => {
    setLoading(true);
    try {
      const response = await listCategories(url);
      setCategories(response);
      setFilteredCategories(response);
      setNextPage(response.next);
      setPreviousPage(response.previous);
    } catch (error) {
      setError('Error al obtener las categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (query) => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCreateCategory = () => {
    setShowCreateModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleToggleStatus = async (categoryId, isActive) => {
    if (window.confirm(`¿Estás seguro de que deseas ${isActive ? "restaurar" : "eliminar"} esta categoría?`)) {
      try {
        await updateCategory(categoryId, { status: isActive });
        fetchCategories();
        showSuccessMessage(`Categoría ${isActive ? "restaurada" : "eliminada"} correctamente.`);
      } catch (error) {
        setError('No se pudo cambiar el estado de la categoría.');
      }
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000); // Ocultar después de 4 segundos
  };

  const headers = ["Nombre de Categoría", "Descripción", "Acciones"];

  const rows = filteredCategories.map((category) => ({
    "Nombre de Categoría": category.name,
    "Descripción": category.description,
    "Acciones": (
      <ButtonsActions
        onEdit={() => handleEditCategory(category)}
        onDelete={() => handleToggleStatus(category.id, false)}
      />
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
            <CategoryToolbar onSearch={handleSearch} onCreate={handleCreateCategory} />
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : loading ? (
              <p>Cargando...</p>
            ) : (
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
                <Table headers={headers} rows={rows} />
              </div>
            )}
          </div>
          <Pagination
            onNext={() => {
              if (nextPage) {
                fetchCategories(nextPage);
                setCurrentPage((prev) => prev + 1);
              }
            }}
            onPrevious={() => {
              if (previousPage) {
                fetchCategories(previousPage);
                setCurrentPage((prev) => prev - 1);
              }
            }}
            hasNext={Boolean(nextPage)}
            hasPrevious={Boolean(previousPage)}
          />
        </div>
      </div>

      {showCreateModal && <CategoryCreateModal onClose={() => setShowCreateModal(false)} />}
      {showEditModal && (
        <CategoryEditModal
          category={selectedCategory}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            fetchCategories();
            showSuccessMessage('Categoría editada correctamente.');
          }}
        />
      )}

      {showSuccess && <SuccessMessage message={successMessage} onClose={() => setShowSuccess(false)} />}
      <Footer />
    </div>
  );
};

export default CategoriesList;
