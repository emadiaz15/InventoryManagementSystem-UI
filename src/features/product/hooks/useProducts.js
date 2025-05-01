import { useState, useEffect, useCallback } from 'react';
import { listProducts } from '../services/listProducts';
import { useAuth } from '../../../context/AuthProvider';

export const useProducts = (filters, initialUrl = "/inventory/products/") => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  }, []);

  const fetchProducts = useCallback(async (url) => {
    if (!isAuthenticated) {
      setError('No estás autenticado');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await listProducts(url);
      if (data && Array.isArray(data.results)) {
        setProducts(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
        setCurrentUrl(url);
      } else {
        throw new Error('Error en el formato de los datos de la API');
      }
    } catch (error) {
      console.error('Error al cargar los productos:', error);
      setProducts([]);
      setError(error.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const query = buildQueryString(filters);
    const baseUrl = initialUrl.split('?')[0];
    const fullUrl = `${baseUrl}${query}`;
    fetchProducts(fullUrl);
  }, [filters, initialUrl, buildQueryString, fetchProducts]);

  const next = useCallback(() => {
    if (nextPageUrl) fetchProducts(nextPageUrl);
  }, [nextPageUrl, fetchProducts]);

  const previous = useCallback(() => {
    if (previousPageUrl) fetchProducts(previousPageUrl);
  }, [previousPageUrl, fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    next,
    previous,
    nextPageUrl,
    previousPageUrl,
    currentUrl
  };
};
