import { useState, useEffect } from 'react';
import { listProducts } from '../services/products/listProducts';
import { useAuth } from '../../../hooks/useAuth';

export const useProducts = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated) {
        setError('No estás autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await listProducts(); 
        if (Array.isArray(data)) {
          setProducts(data); // Almacenamos los productos
        } else {
          setError('Error en el formato de los datos de la API');
          setProducts([]);
        }
      } catch (error) {
        setError('Error al cargar los productos');
        console.error('Error al cargar los productos:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // Hacemos la petición
  }, [isAuthenticated]); // Dependemos de isAuthenticated, pero este valor no cambiará innecesariamente

  return { products, error, loading };
};
