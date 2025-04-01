import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { listCategories } from '../services/listCategory'; // Importa listCategories

const CategoryEditModal = ({ category, isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
    status: category.status,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState([]); // Almacena todas las categorías

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        status: category.status,
      });
    }
  }, [category]);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await listCategories();
        setCategories(response.results || []);
      } catch (err) {
        console.error("Error al obtener las categorías:", err);
      }
    };
    fetchAllCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verificar si el nombre ya existe (excluyendo la categoría actual)
    const nameExists = categories.some(
      (cat) => cat.name === formData.name && cat.id !== category.id
    );

    if (nameExists) {
      setError("El nombre de la categoría ya existe. Debe ser único.");
      return;
    }

    try {
      await onSaveSuccess(formData);
      setSuccessMessage("Categoría actualizada con éxito");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    console.error("Error al actualizar la categoría:", err);
    setError("Hubo un problema al actualizar la categoría. Inténtalo de nuevo.");
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoría">
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} shouldReload={false} />}
          <FormInput
            label="Nombre de la Categoría"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Descripción"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <div className="flex justify-end mt-4">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
    </>
  );
};

export default CategoryEditModal;