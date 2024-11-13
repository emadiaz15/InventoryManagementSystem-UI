// src/components/types/TypeCreateModal.js
import React, { useState } from 'react';
import { createType } from '../services/createType';
import SuccessMessage from '../../../components/common/SuccessMessage';
import Modal from '../../../components/ui/Modal'; // Usar el modal genérico
import TypeForm from './TypeForm';

const TypeCreateModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
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
      await createType(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      onSave();
      onClose();
    } catch (error) {
      setError('No se pudo crear el tipo.');
      console.error('Error al crear el tipo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Crear Nuevo Tipo">
      <TypeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitText="Crear"
      />
      {showSuccess && <SuccessMessage message="¡Tipo creado con éxito!" onClose={() => setShowSuccess(false)} />}
    </Modal>
  );
};

export default TypeCreateModal;
