import { useState, useEffect, useCallback } from "react";
import { listProducts } from "../services/listProducts";
import { invalidateCachedProductsByUrl } from "../services/productCache";
import { buildQueryString } from "@/utils/queryUtils";
import logger from "@/utils/logger";

/**
 * 📦 Hook para gestionar la lista de productos con filtros y paginación.
 *
 * @param {Object} filters - Filtros aplicados a la consulta.
 * @param {string} initialUrl - Endpoint inicial de la API.
 */
export const useProducts = (filters = {}, initialUrl = "/inventory/products/") => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const fetchProducts = useCallback(async (url) => {
    setLoadingProducts(true);
    setError(null);
    logger.log(`📡 Consultando productos desde: ${url}`);

    try {
      const data = await listProducts(url);
      if (data && Array.isArray(data.results)) {
        setProducts(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
        setCurrentUrl(url);
      } else {
        throw new Error("Respuesta inesperada de la API.");
      }
    } catch (err) {
      logger.error("❌ Error al obtener productos:", err);
      setError(err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    const query = buildQueryString(filters);
    const baseUrl = initialUrl.split("?")[0];
    const newUrl = `${baseUrl}${query}`;
    fetchProducts(newUrl);
  }, [filters, initialUrl, fetchProducts]);

  const next = useCallback(() => {
    if (nextPageUrl) fetchProducts(nextPageUrl);
  }, [nextPageUrl, fetchProducts]);

  const previous = useCallback(() => {
    if (previousPageUrl) fetchProducts(previousPageUrl);
  }, [previousPageUrl, fetchProducts]);

  const invalidate = useCallback(() => {
    if (currentUrl) {
      invalidateCachedProductsByUrl(currentUrl);
      fetchProducts(currentUrl);
    }
  }, [currentUrl, fetchProducts]);

  return {
    products,
    loadingProducts,
    error,
    nextPageUrl,
    previousPageUrl,
    fetchProducts,
    next,
    previous,
    currentUrl,
    invalidate,
  };
};

export default useProducts;
