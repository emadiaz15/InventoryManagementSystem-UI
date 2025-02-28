import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { updateType } from '../services/updateType';
import { listCategories } from '../../category/services/listCategory';

const TypeEditModal = ({ type, isOpen, onClose, onSave }) => {
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
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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

    useEffect(() => {
        if (type) {
            setFormData({
                name: type.name,
                description: type.description || '',
                category: type.category?.id || '',
            });
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
            let dataToSend = {
                name: formData.name,
                description: formData.description,
                category: parseInt(formData.category, 10),
            };

            await updateType(type.id, dataToSend);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            console.error('❌ Error al actualizar el tipo:', error.response?.data || error.message);

            if (error.response?.data?.name) {
                setError('El nombre del tipo ya existe. Debe ser único.');
            } else {
                setError('Hubo un problema al actualizar el tipo. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await updateType(type.id, { status: false });
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            setError('No se pudo eliminar el tipo.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Editar Tipo">
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

                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={() => setShowConfirmDialog(true)} className="bg-error-500 text-white py-2 px-4 rounded hover:bg-error-600 transition-colors">
                            Eliminar
                        </button>
                        <button type="submit" className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default TypeEditModal;
