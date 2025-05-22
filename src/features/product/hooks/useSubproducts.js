import { useState, useEffect, useCallback } from 'react';
import { listSubproducts } from '../services/listSubproducts';
  
const buildQueryString = (filtersObj) => {
  const params = new URLSearchParams();
  Object.entries(filtersObj).forEach(([key, value]) => {
    // omitimos valores nulos/undefined/vacíos
    if (value !== '' && value != null) {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

/**
 * Hook para traer subproductos de un producto, con filtros (incluye status) y paginación.
 * @param {string|number} productId
 * @param {object} initialFilters — ej: { page_size: 8, status: 'true' }
 */
export const useSubproducts = (
  productId,
  initialFilters = { page_size: 8, status: 'true' }
) => {
  const [subproducts, setSubproducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubproducts = useCallback(
    async (url = null) => {
      if (!productId) return;
      setLoading(true);
      setError(null);

      try {
        const qs = buildQueryString(filters);
        const baseUrl = `/inventory/products/${productId}/subproducts/`;
        const fullUrl = url || `${baseUrl}${qs}`;
        const data = await listSubproducts(productId, fullUrl);
        setSubproducts(data.results || []);
        setNextPage(data.next);
        setPreviousPage(data.previous);
      } catch (err) {
        console.error(err);
        setError('Error al obtener los subproductos.');
      } finally {
        setLoading(false);
      }
    },
    [productId, filters]
  );

  // recarga al montar y cada vez que cambian filtros
  useEffect(() => {
    fetchSubproducts();
  }, [fetchSubproducts]);

  return {
    subproducts,
    filters,
    setFilters,       // para modificar e.g. setFilters(f => ({ ...f, status: 'false' }))
    nextPage,
    previousPage,
    loading,
    error,
    fetchSubproducts, // para paginar manualmente
  };
};
