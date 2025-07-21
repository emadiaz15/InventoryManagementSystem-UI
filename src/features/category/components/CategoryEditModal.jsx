// src/features/category/components/CategoryEditModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Spinner from "../../../components/ui/Spinner";

const CategoryEditModal = ({
  isOpen,
  onClose,
  category,
  onUpdateCategory,
  isProcessing,
  error,
}) => {
  const [form, setForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onUpdateCategory({ id: category.id, payload: form });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoría">
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Nombre"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormInput
          label="Descripción"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600"
            disabled={isProcessing}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? <Spinner size="5" /> : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryEditModal;
