import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";

const CategoryEditModal = ({ category, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: category.name,
    description: category.description || "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category]);

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
    try {
      await onSave(category.id, formData);
      setSuccessMessage("Categoría actualizada con éxito");
      setTimeout(() => setSuccessMessage(""), 3000);
      onClose();
    } catch (err) {
      setError(err.message || "Error al actualizar la categoría");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(category.id);  // Llama a onDelete para cambiar el status a false
    }
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
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleDelete}  // Asegúrate de que handleDelete se ejecute correctamente
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
            >
              Eliminar
            </button>
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
