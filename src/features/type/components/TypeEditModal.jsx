import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import FormInput from '../../../components/ui/form/FormInput';
import FormSelect from '../../../components/ui/form/FormSelect';
import SuccessMessage from '../../../components/common/SuccessMessage';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { updateType } from '../services/updateType';
import { listCategories } from '../../category/services/listCategory';

const TypeEditModal = ({ type, isOpen, onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        status: type?.status || true,
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // 🔹 Cargar categorías desde el backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await listCategories();
                const activeCategories = data.results.filter(cat => cat.status);
                setCategories(activeCategories);

                // 🔥 Si el tipo ya tiene una categoría, establecerla en el select
                if (type && type.category?.id) {
                    setFormData(prevData => ({
                        ...prevData,
                        category: type.category.id
                    }));
                }
            } catch (error) {
                setError('Error al cargar categorías.');
            }
        };

        fetchCategories();
    }, [type]);

    // 🔹 Cargar datos del tipo cuando el modal se abre
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
        setError("");

        try {
            const dataToSend = {
                name: formData.name,
                description: formData.description,
                category: parseInt(formData.category, 10),
            };

            console.log("📡 Enviando actualización:", dataToSend);
            await onSave(type.id, dataToSend);

            setSuccessMessage("Tipo actualizado correctamente");
            setTimeout(() => {
                setSuccessMessage("");
                onClose();
            }, 2000);
        } catch (err) {
            console.error("❌ Error al actualizar el tipo:", err);

            if (err.response?.data?.name) {
                setError("El nombre del tipo ya existe. Debe ser único.");
            } else {
                setError("Hubo un problema al actualizar el tipo. Inténtalo de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!onDelete) {
            console.error("❌ Error: onDelete no está definido");
            setError("No se puede eliminar el tipo.");
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

            await onDelete(type.id, dataToSend);

            console.log("✅ Eliminación exitosa!");

            setSuccessMessage("Tipo eliminado correctamente");
            setTimeout(() => {
                setSuccessMessage("");
                setShowConfirmDialog(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error("❌ Error al eliminar el tipo:", error.response?.data || error.message);
            setError("No se pudo eliminar el tipo.");
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
                        value={formData.category}
                        onChange={handleChange}
                        options={categories.map(cat => ({
                            value: cat.id,
                            label: cat.name.toUpperCase()
                        }))}
                        required
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                console.log("🛑 Abriendo confirmación de eliminación...");
                                setShowConfirmDialog(true);
                            }}
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
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* ✅ `ConfirmDialog` con `z-index` alto para que se muestre sobre el modal */}
            {showConfirmDialog && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
                    <ConfirmDialog
                        message="¿Estás seguro de que deseas eliminar este tipo?"
                        onConfirm={confirmDelete}
                        onCancel={() => {
                            console.log("🚫 Cancelando eliminación...");
                            setShowConfirmDialog(false);
                        }}
                    />
                </div>
            )}

            {successMessage && (
                <SuccessMessage
                    message={successMessage}
                    onClose={() => setSuccessMessage("")}
                />
            )}
        </>
    );
};

export default TypeEditModal;
