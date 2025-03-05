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
    }, [type, categories]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSend = {
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

            if (error.response?.status === 400) {
                setError(error.response?.data?.detail || 'Error de validación en los datos ingresados.');
            } else {
                setError('Hubo un problema al actualizar el tipo. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!type?.id) {
            setError('No se puede eliminar este tipo.');
            return;
        }

        try {
            setLoading(true);

            const dataToSend = {
                name: formData.name,
                description: formData.description,
                category: parseInt(formData.category, 10),
                status: false, // Soft delete
            };

            console.log("🛠️ Enviando solicitud de eliminación:", dataToSend);

            await updateType(type.id, dataToSend);

            console.log("✅ Eliminación exitosa!");

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setShowConfirmDialog(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            console.error("❌ Error al eliminar el tipo:", error.response?.data || error.message);
            setError('No se pudo eliminar el tipo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Editar Tipo">
                <form onSubmit={handleSubmit}>
                    {error && <ErrorMessage message={error} shouldReload={false} />}

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

                    <FormSelect
                        label="Categoría"
                        name="category"
                        value={formData.category}  // ✅ Mantiene la categoría actual seleccionada
                        onChange={handleChange}
                        options={categories.map(cat => ({
                            value: cat.id,
                            label: cat.name.toUpperCase()
                        }))}
                        required
                        loading={loadingCategories}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => setShowConfirmDialog(true)}
                            className="bg-error-500 text-white py-2 px-4 rounded hover:bg-error-600 transition-colors"
                        >
                            Eliminar
                        </button>

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
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ✅ Ahora el `ConfirmDialog` está fuera del modal y con un `z-index` alto */}
            {showConfirmDialog && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black bg-opacity-50">
                    <ConfirmDialog
                        message="¿Estás seguro de que deseas eliminar este tipo?"
                        onConfirm={handleDelete}
                        onCancel={() => setShowConfirmDialog(false)}
                    />
                </div>
            )}

            {showSuccess && <SuccessMessage message="¡Tipo actualizado correctamente!" onClose={() => setShowSuccess(false)} />}
        </>
    );
};

export default TypeEditModal;
