import { useState, useEffect, useCallback } from "react";
import { listCategories } from "../services/listCategory";

const useCategories = (filters, initialUrl = "/inventory/categories/") => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);

  // Inicializar currentUrl únicamente con la parte base de la URL
  const [currentUrl, setCurrentUrl] = useState(initialUrl.split('?')[0]);

  // Construcción del query string (solo se agrega name si tiene valor)
  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();
    if (filterObj?.name) {
      queryParams.append('name', filterObj.name);
    }
    const queryString = queryParams.toString();
    console.log("Built category query string (HOOK):", queryString);
    return queryString ? `?${queryString}` : "";
  }, []);

  const fetchCategories = useCallback(async (url) => {
    setLoadingCategories(true);
    setError(null);
    console.log(`Fetching categories (hook) from URL: ${url}`);
    try {
      const data = await listCategories(url);
      if (data && Array.isArray(data.results)) {
        setCategories(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
        setCurrentUrl(url); // Actualiza la URL actual solo después del fetch
      } else {
        throw new Error("Respuesta inesperada de la API.");
      }
    } catch (error) {
      console.error("Error fetching categories (hook):", error);
      setError(error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // Cada vez que cambien los filtros se reconstruye la URL y se hace fetch
  useEffect(() => {
    console.log("Filters changed/init in useCategories hook:", filters);
    const query = buildQueryString(filters);
    const baseUrl = initialUrl.split('?')[0];
    const newUrl = `${baseUrl}${query}`;
    fetchCategories(newUrl);
  }, [filters, initialUrl, buildQueryString, fetchCategories]);

  const next = useCallback(() => {
    if (nextPageUrl) {
      fetchCategories(nextPageUrl);
    }
  }, [nextPageUrl, fetchCategories]);

  const previous = useCallback(() => {
    if (previousPageUrl) {
      fetchCategories(previousPageUrl);
    }
  }, [previousPageUrl, fetchCategories]);

  return {
    categories,
    loadingCategories,
    error,
    nextPageUrl,
    previousPageUrl,
    fetchCategories,
    next,
    previous,
    currentUrl,
  };
};

export default useCategories;
