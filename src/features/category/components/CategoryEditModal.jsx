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
    status: true,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 🧠 Usar React Query para cachear categorías
  const { data: categoryList = [] } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => listCategories("/inventory/categories/?limit=1000&status=true"),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: isOpen, // Solo ejecuta si está abierto el modal
    select: (data) => data?.results || [],
  });

  // ⚙️ Actualizar formData cuando se abra el modal con nueva categoría
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        status: category.status,
      });
    }
    setSuccessMessage("");
    setError("");
  }, [category]);

  // 🎯 Control de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Validación y envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameExists = categoryList.some(
      (cat) => cat.name === formData.name && cat.id !== category.id
    );

    if (nameExists) {
      setError("El nombre de la categoría ya existe. Debe ser único.");
      return;
    }

    try {
      await onSaveSuccess(formData);
      setSuccessMessage("Categoría actualizada con éxito.");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 3000);
    } catch (err) {
      console.error("❌ Error al actualizar la categoría:", err);
      setError("Hubo un problema al actualizar la categoría. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoría">
        <form onSubmit={handleSubmit} aria-describedby="edit-category-desc">
          <p id="edit-category-desc" className="sr-only">Formulario para editar la categoría de inventario.</p>

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
