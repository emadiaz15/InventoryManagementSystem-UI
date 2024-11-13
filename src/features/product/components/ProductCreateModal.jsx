import React, { useState, useEffect } from 'react';
import { createProduct } from '../services/products/createProduct'; // Servicio para crear producto
import { listCategories } from '../../category/services/listCategory'; // Servicio para obtener categorías
import { listTypes } from '../../type/services/listType'; // Servicio para obtener tipos

const ProductCreateModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [coilNumber, setCoilNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [initialLength, setInitialLength] = useState('');
  const [finalLength, setFinalLength] = useState('');
  const [observations, setObservations] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Cargar categorías y tipos cuando el componente se monte
  useEffect(() => {
    const fetchCategoriesAndTypes = async () => {
      try {
        const categoriesResponse = await listCategories();
        const typesResponse = await listTypes();
        
        setCategories(categoriesResponse);
        setTypes(typesResponse);
      } catch (error) {
        console.error('Error al obtener categorías o tipos:', error);
      }
    };

    fetchCategoriesAndTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear el objeto JSON para metadata
    const metadata = {
      'N° de bobina': coilNumber,
      'Peso': weight,
      'Longitud Inicio': initialLength,
      'Longitud Final': finalLength,
      'Observaciones': observations,
    };

    const newProduct = {
      name,
      code,
      type,
      category,
      brand,
      description,
      metadata, // Añadir el objeto metadata
    };

    try {
      await createProduct(newProduct);
      onSave(); // Llamar a la función de guardado para refrescar la lista
      onClose(); // Cerrar el modal después de la creación exitosa
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Hubo un error al crear el producto.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-2xl mb-4">Crear Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          {/* Select para Categoría */}
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="mb-4 w-full p-2 border"
          >
            <option value="">Seleccione Categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Select para Tipo */}
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            className="mb-4 w-full p-2 border"
          >
            <option value="">Seleccione Tipo</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Código" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required 
            className="mb-4 w-full p-2 border"
          />
          <input 
            type="text" 
            placeholder="Nombre del Producto" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="mb-4 w-full p-2 border"
          />
          <input 
            type="text" 
            placeholder="Marca" 
            value={brand} 
            onChange={(e) => setBrand(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />
          <textarea 
            placeholder="Descripción" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />

          {/* Campos para Metadata */}
          <input 
            type="text" 
            placeholder="N° de Bobina" 
            value={coilNumber} 
            onChange={(e) => setCoilNumber(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />
          <input 
            type="text" 
            placeholder="Peso" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />
          <input 
            type="text" 
            placeholder="Longitud Inicio" 
            value={initialLength} 
            onChange={(e) => setInitialLength(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />
          <input 
            type="text" 
            placeholder="Longitud Final" 
            value={finalLength} 
            onChange={(e) => setFinalLength(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />
          <textarea 
            placeholder="Observaciones" 
            value={observations} 
            onChange={(e) => setObservations(e.target.value)} 
            className="mb-4 w-full p-2 border"
          />

          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreateModal;
