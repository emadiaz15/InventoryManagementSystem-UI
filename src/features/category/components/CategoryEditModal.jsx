import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useQuery } from '@tanstack/react-query';
import { listCategories } from '../services/listCategory';

const CategoryEditModal = ({ category, isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: categoryList = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => listCategories("/inventory/categories/?limit=1000&status=true"),
    staleTime: 1000 * 60 * 5,
    enabled: isOpen,
    select: (data) => data?.results || [],
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    }
    setSuccessMessage("");
    setError("");
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = formData.name.trim();
    const cleanDescription = formData.description?.trim() || '';

    if (!cleanName) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    const nameExists = categoryList.some(
      (cat) => cat.name.toLowerCase() === cleanName.toLowerCase() && cat.id !== category.id
    );

    if (nameExists) {
      setError("El nombre de la categoría ya existe. Debe ser único.");
      return;
    }

    try {
      await onSaveSuccess({
        name: cleanName,
        description: cleanDescription,
      });

      setSuccessMessage("Categoría actualizada con éxito.");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      console.error("❌ Error al actualizar la categoría:", err);
      setError(err.message || "Hubo un problema al actualizar la categoría.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoría">
        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}

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

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
            >
              Guardar
            </button>
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
