// src/components/types/TypeModal.js
import React, { useState, useEffect } from 'react';
import { createType } from '../services/createType';
import { updateType } from '../services/updateType';
import SuccessMessage from '../../../components/common/SuccessMessage';
import Modal from '../../../components/ui/Modal';
import TypeForm from './TypeForm';

const TypeModal = ({ type = null, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (type) {
      setFormData({ name: type.name, description: type.description });
    }
  }, [type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type) {
        await updateType(type.id, formData); // Editar
      } else {
        await createType(formData); // Crear
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
      onSave();
      onClose();
    } catch (error) {
      setError(type ? 'No se pudo actualizar el tipo.' : 'No se pudo crear el tipo.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={type ? 'Editar Tipo' : 'Crear Nuevo Tipo'}>
      <TypeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitText={type ? 'Guardar' : 'Crear'}
        onCancel={onClose}
      />
      {showSuccess && <SuccessMessage message={type ? "¡Tipo actualizado con éxito!" : "¡Tipo creado con éxito!"} onClose={() => setShowSuccess(false)} />}
    </Modal>
  );
};

export default TypeModal;
