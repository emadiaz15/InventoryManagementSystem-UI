import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import SuccessMessage from '../../../components/common/SuccessMessage';
import { createType } from '../services/createType';
import { updateType } from '../services/updateType';
import { listCategories } from '../../category/services/listCategory';

const TypeCreateModal = ({ type = null, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', description: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Cargar categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        console.log("📂 Categorías obtenidas:", data.results);
        setCategories(data.results.filter(cat => cat.status)); // Filtra solo activas
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Cargar datos de edición
  useEffect(() => {
    if (type) {
      setFormData({
        name: type.name,
        description: type.description || '',
        category: type.category?.id || '',
      });
    } else {
      setFormData({ name: '', description: '', category: '' });
    }
  }, [type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("📤 Datos enviados:", formData);

      let dataToSend = {
        name: formData.name,
        description: formData.description,
        category: formData.category ? parseInt(formData.category) : null, // Asegurar que se envía un ID numérico
      };

      let response;
      if (type) {
        response = await updateType(type.id, dataToSend);
      } else {
        response = await createType(dataToSend);
      }

      console.log("✅ Respuesta de la API:", response);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Error al procesar el tipo:', error.response?.data || error.message);
      setError(error.message || 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={type ? 'Editar Tipo' : 'Crear Nuevo Tipo'}>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-error-500 mb-4">{error}</p>}

        <FormInput
          label="Nombre del Tipo"
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

        {/* Lista desplegable con FormSelect */}
        <FormSelect
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories.map(cat => ({
            value: cat.id,
            label: cat.name,
          }))}
          required
          loading={loadingCategories}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Guardando...' : type ? 'Guardar' : 'Crear Tipo'}
          </button>
        </div>
      </form>

      {showSuccess && (
        <SuccessMessage message={type ? "¡Tipo actualizado con éxito!" : "¡Tipo creado con éxito!"} onClose={() => setShowSuccess(false)} />
      )}
    </Modal>
  );
};

export default TypeCreateModal;
