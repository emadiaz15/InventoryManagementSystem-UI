import { useState, useEffect, useCallback } from 'react';
import { listProducts } from '../services/listProducts';
import { useAuth } from '../../../context/AuthProvider';

export const useProducts = (filters, initialUrl = "/inventory/products/") => {
  const { isAuthenticated } = useAuth();

  // 👇 Inicialmente null para distinguir "loading" de "sin resultados"
  const [products, setProducts] = useState(null);
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
    return queryParams.toString() ? `?${queryParams}` : "";
  }, []);

  const fetchProducts = useCallback(async (url) => {
    if (!isAuthenticated) {
      setError("No estás autenticado");
      setProducts([]); // Limpia para prevenir mostrar data vieja
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
        setError(null); // 🧼 Limpia errores anteriores si fue exitoso
      } else {
        throw new Error("Formato de datos inválido desde la API");
      }
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
      setProducts([]); // 👈 Limpia productos
      setError(err.message || "Error al cargar los productos");
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
    loadingProducts: loading, // 🔁 Renombra aquí para mantener compatibilidad
    error,
    fetchProducts,
    next,
    previous,
    nextPageUrl,
    previousPageUrl,
    currentUrl
  };
};
