import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import SuccessMessage from '../../../components/common/SuccessMessage';
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
    const [successMessage, setSuccessMessage] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Cargar la lista de categorías activas
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

    // Cargar los datos del tipo seleccionado
    useEffect(() => {
        if (type) {
            setFormData({
                name: type.name || '',
                description: type.description || '',
                category: type.category?.id || '', // Usa el ID de la categoría
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


    // Confirmar eliminación (soft delete)
    const handleDelete = async () => {
        try {
            await updateType(type.id, { status: false });
            setSuccessMessage('¡Tipo eliminado correctamente!');

            setTimeout(() => {
                setSuccessMessage('');
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            console.error('❌ Error al eliminar el tipo:', error);
            setError('No se pudo eliminar el tipo.');
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Editar Tipo">
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

                    {/* Lista desplegable de categorías */}
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
                    />

                    <div className="flex justify-between mt-4">
                        {/* Botón de eliminar */}
                        <button
                            type="button"
                            onClick={() => setShowConfirmDialog(true)}
                            className="bg-error-500 text-white py-2 px-4 rounded hover:bg-error-600 transition-colors"
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
                                className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </form>

                {successMessage && (
                    <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
                )}
            </Modal>

            {/* Modal de confirmación de eliminación */}
            {showConfirmDialog && (
                <ConfirmDialog
                    message="¿Estás seguro de que deseas eliminar este tipo?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirmDialog(false)}
                />
            )}
        </>
    );
};

export default TypeEditModal;
