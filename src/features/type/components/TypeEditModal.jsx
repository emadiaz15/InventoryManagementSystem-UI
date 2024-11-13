// src/components/types/TypeEditModal.js
import React, { useState } from 'react';
import { updateType } from '../updateType';
import SuccessMessage from '../../../components/common/SuccessMessage';
import Modal from '../../../components/ui/Modal';
import TypeForm from './TypeForm';

const TypeEditModal = ({ type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: type.name || '',
    description: type.description || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateType(type.id, formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      onSave();
      onClose();
    } catch (error) {
      setError('No se pudo actualizar el tipo.');
      console.error('Error al actualizar el tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Editar Tipo">
      <TypeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitText="Guardar"
      />
      {showSuccess && <SuccessMessage message="¡Tipo actualizado con éxito!" onClose={() => setShowSuccess(false)} />}
    </Modal>
  );
};

export default TypeEditModal;
