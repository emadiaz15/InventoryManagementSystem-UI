import { useState, useEffect, useCallback } from "react";
import { listUsers } from "../services/listUsers";
import { invalidateCachedUsersByUrl } from "../services/userCache";

const useUsers = (filters, initialUrl = "/users/list/") => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [previousPageUrl, setPreviousPageUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const buildQueryString = useCallback((filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      let apiValue = value;
      if (apiValue && apiValue !== '') {
        if (key === "is_active") {
          if (typeof apiValue === 'string') {
            if (apiValue.toLowerCase() === "activo") apiValue = "true";
            else if (apiValue.toLowerCase() === "inactivo") apiValue = "false";
            else if (apiValue !== 'true' && apiValue !== 'false') apiValue = '';
          } else {
            apiValue = apiValue ? 'true' : 'false';
          }
        } else if (key === "is_staff") {
          if (typeof apiValue === 'string') {
            if (apiValue.toLowerCase() === "admin") apiValue = "true";
            else if (apiValue.toLowerCase() === "operario") apiValue = "false";
            else if (apiValue !== 'true' && apiValue !== 'false') apiValue = '';
          } else {
            apiValue = apiValue ? 'true' : 'false';
          }
        }
        if (apiValue) {
          queryParams.append(key, apiValue);
        }
      }
    });
    const queryString = queryParams.toString();
    console.log("Built query string (HOOK):", queryString);
    return queryString ? `?${queryString}` : "";
  }, []);

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
      } else {
        throw new Error("Respuesta inesperada de la API.");
      }
    } catch (error) {
      console.error("Error fetching users (hook):", error);
      setError(error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    console.log("Filters changed in hook, triggering fetch:", filters);
    const query = buildQueryString(filters);
    const baseUrl = initialUrl.split('?')[0];
    const newUrl = `${baseUrl}${query}`;
    fetchUsers(newUrl);
  }, [filters, initialUrl, buildQueryString, fetchUsers]);

  const next = useCallback(() => {
    if (nextPageUrl) {
      fetchUsers(nextPageUrl);
    }
  }, [nextPageUrl, fetchUsers]);

  const previous = useCallback(() => {
    if (previousPageUrl) {
      fetchUsers(previousPageUrl);
    }
  }, [previousPageUrl, fetchUsers]);

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
