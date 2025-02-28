import React, { useState, useEffect } from 'react';
import { createSubproduct } from '../services/createSubproducts';
import { listProducts } from '../services/listProducts';
import SuccessMessage from '../../../components/common/SuccessMessage';

const SubproductFormModal = ({ parentProduct, isOpen, onClose, onSave }) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        parent: parentProduct?.id || '',
        description: '',
    });
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await listProducts();
                setProducts(data.results || []);
            } catch (error) {
                setError('Error al cargar productos padres.');
            }
        };
        fetchProducts();

        if (parentProduct) {
            setFormData((prev) => ({ ...prev, parent: parentProduct.id }));
        }
    }, [parentProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createSubproduct(formData.parent, formData);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            setError('No se pudo guardar el subproducto');
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-md w-1/2">
                    <h2 className="text-2xl mb-4">Crear Subproducto</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" className="w-full border p-2 rounded mb-2" required />
                        <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Código" className="w-full border p-2 rounded mb-2" required />
                        <select name="parent" value={formData.parent} onChange={handleChange} className="w-full border p-2 rounded mb-2" required>
                            <option value="">Seleccionar Producto Padre</option>
                            {products.map((prod) => (
                                <option key={prod.id} value={prod.id}>{prod.name}</option>
                            ))}
                        </select>
                        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción" className="w-full border p-2 rounded mb-2"></textarea>
                        <div className="flex justify-end space-x-2">
                            <button onClick={onClose} className="bg-gray-500 text-white py-2 px-4 rounded">Cancelar</button>
                            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Guardar</button>
                        </div>
                    </form>
                    {showSuccess && <SuccessMessage message="¡Subproducto guardado exitosamente!" onClose={() => setShowSuccess(false)} />}
                </div>
            </div>
        )
    );
};

export default SubproductFormModal;
