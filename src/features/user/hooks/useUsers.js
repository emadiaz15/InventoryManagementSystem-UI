// src/hooks/useUsers.js
import { useState, useEffect } from "react";
import { listUsers } from "../services/listUsers"; // Ajusta la ruta

const useUsers = (filters, initialUrl = "/users/list/") => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  // Helper: Build query string from filters (include conversion for booleans)
  const buildQueryString = (filterObj) => {
    const queryParams = new URLSearchParams();
    Object.entries(filterObj).forEach(([key, value]) => {
      if (value) {
        if (key === "is_active") {
          value = value.toLowerCase() === "activo" ? "true" : "false";
        }
        if (key === "is_staff") {
          if (value.toLowerCase() === "sí") {
            value = "true";
          } else if (value.toLowerCase() === "no") {
            value = "false";
          }
        }
        queryParams.append(key, value);
      }
    });
    return queryParams.toString() ? `?${queryParams.toString()}` : "";
  };

  const fetchUsers = async (url = initialUrl) => {
    setLoadingUsers(true);
    try {
      const data = await listUsers(url);
      if (data && Array.isArray(data.results)) {
        setUsers(data.results);
        setNextPage(data.next);
        setPreviousPage(data.previous);
        setTotalPages(Math.ceil(data.count / 10));
      } else {
        setError(new Error("Error en el formato de los datos de la API"));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // When filters change, rebuild the URL and fetch data
  useEffect(() => {
    const query = buildQueryString(filters);
    setCurrentPage(1);
    fetchUsers(`${initialUrl}${query}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const next = () => {
    if (nextPage) {
      fetchUsers(nextPage);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previous = () => {
    if (previousPage) {
      fetchUsers(previousPage);
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    users,
    loadingUsers,
    error,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    fetchUsers,
    next,
    previous,
  };
};

export default useUsers;
