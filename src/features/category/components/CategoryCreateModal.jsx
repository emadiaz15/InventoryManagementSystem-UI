// src/features/category/components/CategoryCreateModal.jsx
import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import ErrorMessage from "../../../components/common/ErrorMessage";
import Spinner from "../../../components/ui/Spinner";

const CategoryCreateModal = ({
  isOpen,
  onClose,
  onCreate,
  isProcessing,
  error,
}) => {
  const [form, setForm] = useState({ name: "", description: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await onCreate(form);
    setForm({ name: "", description: "" });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Categoría">
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
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
            {isProcessing ? <Spinner size="5" /> : "Crear Categoría"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryCreateModal;
