// src/features/category/components/CategoryCreateModal.jsx
import React from "react";
import Modal from "@/components/ui/Modal";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/ui/Spinner";
import FormInput from "@/components/ui/form/FormInput";
import { useCategoryFormState } from "../hooks/useCategoryFormState";
import useSuccess from "@/hooks/useSuccess";

const CategoryCreateModal = ({ isOpen, onClose, onCreate, isProcessing }) => {
  const { formData, handleChange, resetForm, validate, validationErrors } =
    useCategoryFormState();
  const { error, handleError, clear: clearStatus } = useSuccess();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearStatus();

    if (!validate()) return;

    try {
      await onCreate(formData);
      resetForm(); // Limpia el form solo si fue exitosa la creación
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Categoría">
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={validationErrors.name?.[0]}
        />

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
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
