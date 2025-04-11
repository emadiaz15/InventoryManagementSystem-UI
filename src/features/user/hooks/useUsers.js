import { useState, useEffect, useCallback } from "react";
import { listUsers } from "../services/listUsers"; // Ajusta la ruta si es necesario

const useUsers = (filters, initialUrl = "/users/list/") => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1); // Podría deducirse o no ser necesario exponerlo
  // const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl); // Guarda la URL usada

  // --- Construcción de Query String (CON LÓGICA DE CONVERSIÓN) ---
  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      let apiValue = value; // Valor a enviar a la API

      // Solo procesar si hay valor Y NO es "Todos" (asumiendo '' como valor para 'Todos')
      if (apiValue && apiValue !== '') {
        // --- CONVERSIÓN AÑADIDA ---
        // Convertir valores de display/estado a booleanos como string para la API
        if (key === "is_active") {
          // Asume que el valor en filterObj puede ser 'true', 'false' O 'Activo'/'Inactivo'
          // Lo normalizamos a 'true' o 'false'
          if (typeof apiValue === 'string') {
              if (apiValue.toLowerCase() === "activo") apiValue = "true";
              else if (apiValue.toLowerCase() === "inactivo") apiValue = "false";
              // Si ya es 'true' o 'false', se queda igual. Si es otra cosa, se ignora.
              else if (apiValue !== 'true' && apiValue !== 'false') apiValue = '';
          } else { // Si no es string (ej. booleano directo?), convertir
             apiValue = apiValue ? 'true' : 'false';
          }

        } else if (key === "is_staff") {
          // Asume que el valor puede ser 'true', 'false' O 'Admin'/'Operario'
           if (typeof apiValue === 'string') {
              if (apiValue.toLowerCase() === "admin") apiValue = "true";
              else if (apiValue.toLowerCase() === "operario") apiValue = "false";
               // Si ya es 'true' o 'false', se queda igual. Si es otra cosa, se ignora.
              else if (apiValue !== 'true' && apiValue !== 'false') apiValue = '';
           } else {
              apiValue = apiValue ? 'true' : 'false';
           }
        }
        // --- FIN CONVERSIÓN ---

        // Añadir a los query params SOLO si apiValue tiene contenido después de la conversión
        if (apiValue) {
          queryParams.append(key, apiValue);
        }
      }
    });
    const queryString = queryParams.toString();
    console.log("Built query string (HOOK):", queryString);
    return queryString ? `?${queryString}` : "";
  }, []); // Sin dependencias externas, es una función pura

  // --- Fetching de Datos (Usa la URL completa) ---
  const fetchUsers = useCallback(async (url) => {
    const urlToFetch = url;
    setLoadingUsers(true);
    setError(null);
    console.log(`Workspaceing users (hook) from URL: ${urlToFetch}`);
    try {
      const data = await listUsers(urlToFetch);
      if (data && Array.isArray(data.results)) {
        setUsers(data.results);
        setNextPageUrl(data.next);
        setPreviousPageUrl(data.previous);
        setCurrentUrl(urlToFetch);
        // setTotalPages(data.count ? Math.ceil(data.count / 10) : 1); // Opcional
      } else { throw new Error("Respuesta inesperada de la API."); }
    } catch (error) {
      console.error("Error fetching users (hook):", error);
      setError(error); setUsers([]);
    } finally { setLoadingUsers(false); }
  }, []); // No depende de nada externo

  // --- Efecto para Recargar al Cambiar Filtros ---
  useEffect(() => {
    // No ejecutar en montaje inicial si el otro efecto ya carga
    // if (isInitialMount) return; // Necesitaríamos recibir isInitialMount o manejarlo diferente
    console.log("Filters changed in hook, triggering fetch:", filters);
    const query = buildQueryString(filters);
    const baseUrl = initialUrl.split('?')[0];
    const newUrl = `${baseUrl}${query}`;
    fetchUsers(newUrl); // Fetch página 1 con nuevos filtros
  }, [filters, initialUrl, buildQueryString, fetchUsers]); // Depende de filters

  // --- Funciones de Paginación ---
  const next = useCallback(() => { if (nextPageUrl) { fetchUsers(nextPageUrl); } }, [nextPageUrl, fetchUsers]);
  const previous = useCallback(() => { if (previousPageUrl) { fetchUsers(previousPageUrl); } }, [previousPageUrl, fetchUsers]);

  // --- Retorno del Hook ---
  return {
    users, loadingUsers, error,
    nextPageUrl, previousPageUrl,
    fetchUsers, // Función para recargar explícitamente si es necesario
    next, previous,
    currentUrl // URL actual para la recarga post-acción
  };
};

export default useUsers;