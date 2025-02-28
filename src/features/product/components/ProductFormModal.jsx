import React, { useState, useEffect } from 'react';
import { createProduct } from '../services/createProduct';
import { updateProduct } from '../services/updateProduct';
import listCategories from '../../category/services/listCategory';
import listTypes from '../../type/services/listType';
import SuccessMessage from '../../../components/common/SuccessMessage';

const ProductFormModal = ({ product = null, isOpen, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        category: '',
        type: '',
        description: '',
        stock_quantity: 0,
    });
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, typesData] = await Promise.all([listCategories(), listTypes()]);
                setCategories(categoriesData);
                setTypes(typesData);
            } catch (error) {
                setError('Error al cargar categorías y tipos');
            }
        };
        fetchData();
        if (product) {
            setFormData({
                name: product.name,
                code: product.code,
                category: product.category?.id || '',
                type: product.type?.id || '',
                description: product.description || '',
                stock_quantity: product.stock_quantity || 0,
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            setError('No se pudo guardar el producto');
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-md w-1/2">
                    <h2 className="text-2xl mb-4">{product ? 'Editar Producto' : 'Crear Producto'}</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className="w-full border p-2 rounded mb-2" required />
                        <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Código" className="w-full border p-2 rounded mb-2" required />
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full border p-2 rounded mb-2" required>
                            <option value="">Seleccionar Categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2 rounded mb-2">
                            <option value="">Seleccionar Tipo</option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" className="w-full border p-2 rounded mb-2"></textarea>
                        <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="Cantidad de Stock" className="w-full border p-2 rounded mb-2" min="0" />
                        <div className="flex justify-end space-x-2">
                            <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">Cancelar</button>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Guardar</button>
                        </div>
                    </form>
                    {showSuccess && <SuccessMessage message="¡Producto guardado exitosamente!" onClose={() => setShowSuccess(false)} />}
                </div>
            </div>
        )
    );
};

export default ProductFormModal;
