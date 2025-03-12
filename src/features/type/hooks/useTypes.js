import { useState, useEffect } from 'react';
import { listTypes } from '../services/listType'; // Ya tienes esta importación
import { updateType } from '../services/updateType'; // Asegúrate de importar también la función updateType
import { listCategories } from '../../category/services/listCategory'; // Ajusta la ruta según sea necesario

export const useTypes = () => {
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);  // Estado para las categorías
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar los tipos desde la API
    const fetchTypes = async (url = "/inventory/types/") => {
        setLoading(true);
        try {
            const data = await listTypes(url);
            setTypes(data.activeTypes || []);
        } catch (error) {
            setError("Error al cargar los tipos.");
        } finally {
            setLoading(false);
        }
    };

    // Cargar las categorías desde la API
    const fetchCategories = async () => {
        try {
            const data = await listCategories();
            setCategories(data.results || []); // Asigna las categorías activas
        } catch (error) {
            console.error("❌ Error al obtener las categorías:", error);
        }
    };

    useEffect(() => {
        fetchTypes(); // Llamar a fetchTypes cuando el componente se monte
    }, []);

    useEffect(() => {
        fetchCategories(); // Llamar a fetchCategories cuando el componente se monte
    }, []);

    // Eliminar tipo
    const handleDeleteType = async (typeId) => {
        try {
            await updateType(typeId, { status: false }); // Cambia el estado de 'status' a 'false' para marcarlo como eliminado
            fetchTypes(); // Recargar los tipos después de la eliminación
            return true; // El tipo se eliminó correctamente
        } catch (error) {
            setError("No se pudo eliminar el tipo.");
            return false; // Error en la eliminación
        }
    };

    return { types, categories, loading, error, fetchTypes, handleDeleteType };
};
