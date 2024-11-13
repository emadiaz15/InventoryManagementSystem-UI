import React, { useState, useEffect } from 'react';
import { listCategories } from '../services/listCategory';
import { deleteCategory } from '../services/deleteCategory';
import Navbar from '../../../components/common/Navbar';
import Sidebar from '../../../components/common/Sidebar';
import Footer from '../../../components/common/Footer';
import CategoryToolbar from '../components/CategoryToolbar';
import CategoryCreateModal from '../components/CategoryCreateModal';
import CategoryEditModal from '../components/CategoryEditModal';
import SuccessMessage from '../../../components/common/SuccessMessage'; // Importar el componente SuccessMessage

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // Estado para mostrar el mensaje de éxito
  const [successMessage, setSuccessMessage] = useState(''); // Mensaje de éxito

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      setCategories(response);
      setFilteredCategories(response);
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      setError('Error al obtener las categorías.');
    }
  };

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

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await deleteCategory(categoryId);
        fetchCategories(); // Recargar categorías después de la eliminación
        showSuccessMessage('Categoría eliminada correctamente.'); // Mostrar mensaje de éxito
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        setError('No se pudo eliminar la categoría.');
      }
    }
  };

  // Función para mostrar el mensaje de éxito
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000); // Ocultar después de 4 segundos
  };

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
            ) : (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
                  <tr>
                    <th className="px-6 py-3">Nombre de Categoría</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4">{category.name}</td>
                      <td className="px-6 py-4">{category.description}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button 
                          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                          onClick={() => handleEditCategory(category)}
                        >
                          Editar
                        </button>
                        <button 
                          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && <CategoryCreateModal onClose={() => setShowCreateModal(false)} />}
      {showEditModal && (
        <CategoryEditModal
          category={selectedCategory}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            fetchCategories(); // Recargar categorías después de la edición
            showSuccessMessage('Categoría editada correctamente.'); // Mostrar mensaje de éxito
          }}
        />
      )}

      {/* Mensaje de éxito */}
      {showSuccess && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setShowSuccess(false)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default CategoriesList;
