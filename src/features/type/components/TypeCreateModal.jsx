import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { createType } from '../services/createType';
import { listCategories } from '../../category/services/listCategory';

const TypeCreateModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        setCategories(data.results.filter(cat => cat.status));
      } catch (error) {
        setError('Error al cargar categorías.');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let dataToSend = {
        name: formData.name,
        description: formData.description,
        category: parseInt(formData.category, 10),
      };

      await createType(dataToSend);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSave();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('❌ Error al crear el tipo:', error.response?.data || error.message);

      if (error.response?.data?.name) {
        setError('El nombre del tipo ya existe. Debe ser único.');
      } else {
        setError('Hubo un problema al crear el tipo. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Tipo">
      <form onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} shouldReload={false} />}

        <FormInput label="Nombre del Tipo" type="text" name="name" value={formData.name} onChange={handleChange} required />
        <FormInput label="Descripción" type="text" name="description" value={formData.description} onChange={handleChange} />

        <FormSelect
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
          required
          loading={loadingCategories}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button type="button" onClick={onClose} className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors">
            Cancelar
          </button>
          <button type="submit" className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Guardando...' : 'Crear Tipo'}
          </button>
        </div>
      </form>

      {showSuccess && <SuccessMessage message="¡Tipo creado con éxito!" onClose={() => setShowSuccess(false)} />}
    </Modal>
  );
};

export default TypeCreateModal;
