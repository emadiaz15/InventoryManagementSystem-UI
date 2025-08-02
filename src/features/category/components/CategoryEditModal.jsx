// src/features/category/components/CategoryEditModal.jsx
import React, { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/form/FormInput";
import ErrorMessage from "@/components/common/ErrorMessage";
import Spinner from "@/components/ui/Spinner";
import { useCategoryFormState } from "../hooks/useCategoryFormState";
import useSuccess from "@/hooks/useSuccess";

const CategoryEditModal = ({
  isOpen,
  onClose,
  category,
  onUpdateCategory,
  isProcessing,
}) => {
  const {
    formData,
    setFormData,
    handleChange,
    resetForm,
    validate,
    validationErrors,
  } = useCategoryFormState();

  const { error, handleError, clear: clearStatus } = useSuccess();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category, setFormData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearStatus();

    if (!validate()) return;

    try {
      await onUpdateCategory({ id: category.id, payload: formData });
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoría">
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
        <FormInput
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
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
            {isProcessing ? <Spinner size="5" /> : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryEditModal;
