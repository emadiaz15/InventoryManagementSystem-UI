import { useState, useEffect, useCallback } from "react";
import { listUsers } from "../services/listUsers";
import { invalidateCachedUsersByUrl } from "../services/userCache";
import logger from "../../utils/logger";

/**
 * 📦 Hook para gestionar listado de usuarios con filtros, paginación e invalidación de caché.
 *
 * @param {Object} filters - Filtros aplicados a la consulta.
 * @param {string} initialUrl - Endpoint inicial de la API.
 * @returns {Object} - Estado y funciones del listado.
 */
const useUsers = (filters, initialUrl = "/users/list/") => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  // 🔧 Construye query string basado en filtros
  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();

    Object.entries(filterObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        let apiValue = value;

        if (key === "is_active") {
          apiValue = (apiValue === true || apiValue === "true" || apiValue.toLowerCase() === "activo") ? "true" :
                     (apiValue === false || apiValue === "false" || apiValue.toLowerCase() === "inactivo") ? "false" : "";
        }

        if (key === "is_staff") {
          apiValue = (apiValue === true || apiValue === "true" || apiValue.toLowerCase() === "admin") ? "true" :
                     (apiValue === false || apiValue === "false" || apiValue.toLowerCase() === "operario") ? "false" : "";
        }

        if (apiValue) queryParams.append(key, apiValue);
      }
    });

    const queryString = queryParams.toString();
    logger.log("🔧 Query string generado (HOOK):", queryString);
    return queryString ? `?${queryString}` : "";
  }, []);

  // 📥 Trae usuarios desde API
  const fetchUsers = useCallback(async (url) => {
    setLoadingUsers(true);
    setError(null);
    logger.log(`📡 Consultando usuarios desde: ${url}`);

    try {
      const data = await listUsers(url);
      if (data && Array.isArray(data.results)) {
        setUsers(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
        setCurrentUrl(url);
      } else {
        throw new Error("Respuesta inesperada de la API.");
      }
    } catch (error) {
      console.error("❌ Error al obtener usuarios:", error);
      setError(error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // 📊 Reacciona a cambios de filtros
  useEffect(() => {
    const query = buildQueryString(filters);
    const baseUrl = initialUrl.split('?')[0];
    const newUrl = `${baseUrl}${query}`;
    fetchUsers(newUrl);
  }, [filters, initialUrl, buildQueryString, fetchUsers]);

  // ⏭ Paginación siguiente
  const next = useCallback(() => {
    if (nextPageUrl) fetchUsers(nextPageUrl);
  }, [nextPageUrl, fetchUsers]);

  // ⏮ Paginación anterior
  const previous = useCallback(() => {
    if (previousPageUrl) fetchUsers(previousPageUrl);
  }, [previousPageUrl, fetchUsers]);

  // ♻️ Invalidar cache y refrescar
  const invalidate = useCallback(() => {
    if (currentUrl) {
      invalidateCachedUsersByUrl(currentUrl);
      fetchUsers(currentUrl);
    }
  }, [currentUrl, fetchUsers]);

  return {
    users,
    loadingUsers,
    error,
    nextPageUrl,
    previousPageUrl,
    fetchUsers,
    next,
    previous,
    currentUrl,
    invalidate,
  };
};

export default useUsers;
