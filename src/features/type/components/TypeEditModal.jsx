import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import ErrorMessage from '../../../components/common/ErrorMessage';

const TypeEditModal = ({ type, isOpen, onClose, onSave, categories, loadingCategories }) => {
    // Estado interno para el formulario, carga y error del modal
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '', // Guardará el ID de la categoría (string)
    });
    const [internalLoading, setInternalLoading] = useState(false);
    const [internalError, setInternalError] = useState('');

    // Efecto para inicializar el formulario cuando 'type' cambia o se abre el modal
    useEffect(() => {
        if (isOpen && type) {
            console.log("Initializing edit form with type:", type);
            setFormData({
                name: type.name || '',
                description: type.description || '',
                // Usa el ID de la categoría, convertido a string, si existe
                category: type.category ? type.category.toString() : '',
            });
            setInternalError('');
            setInternalLoading(false);
        }
        if (!isOpen) {
            setFormData({ name: '', description: '', category: '' });
            setInternalError('');
        }
    }, [type, isOpen]);

    // Handler para cambios en el formulario
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    }, []);

    // Handler para el envío del formulario
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!type?.id) {
            setInternalError("No se puede guardar sin un ID de tipo válido.");
            return;
        }
        setInternalLoading(true);
        setInternalError('');

        let categoryId = null;
        if (formData.category) {
            const parsedId = parseInt(formData.category, 10);
            if (!isNaN(parsedId)) {
                categoryId = parsedId;
            } else {
                setInternalError("El ID de la categoría seleccionada no es válido.");
                setInternalLoading(false);
                return;
            }
        }

        const dataToSend = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            ...(categoryId !== null && { category: categoryId }),
        };

        console.log(`Datos a enviar desde TypeEditModal para ID ${type.id}:`, dataToSend);

        try {
            await onSave(type.id, dataToSend);
        } catch (err) {
            console.error('❌ Error capturado en TypeEditModal:', err);
            setInternalError(err.message || 'Hubo un problema al actualizar el tipo.');
        } finally {
            setInternalLoading(false);
        }
    }, [formData, type, onSave]);

    // Genera opciones para el select sin placeholder duplicado
    const categoryOptions = useMemo(() => {
        const options = [];
        categories.forEach(cat => {
            options.push({ value: cat.id.toString(), label: cat.name });
        });
        return options;
    }, [categories]);

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Editar Tipo: ${type?.name || ''}`}>
                <form onSubmit={handleSubmit}>
                    {internalError && <ErrorMessage message={internalError} onClose={() => setInternalError('')} />}
                    <FormInput
                        label="Nombre del Tipo"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={internalLoading}
                    />
                    <FormInput
                        label="Descripción"
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={internalLoading}
                    />
                    <FormSelect
                        label="Categoría"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={categoryOptions}
                        required
                        loading={loadingCategories}
                        disabled={internalLoading || loadingCategories}
                    />
                    <div className="flex justify-end mt-4">
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50"
                                disabled={internalLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${internalLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={internalLoading || loadingCategories}
                            >
                                {internalLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default TypeEditModal;
