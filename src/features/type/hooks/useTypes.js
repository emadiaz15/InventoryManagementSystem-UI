// src/features/type/hooks/useTypes.js
import { useQuery } from "@tanstack/react-query";
import { listTypes } from "@/features/type/services/types";

export const useTypes = (filters = {}) => {
  const {
    data,
    isLoading: loading,
    isError,
    error
  } = useQuery({
    queryKey: ["types", filters],
    queryFn: () => listTypes(filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  return {
    types: data?.results || [],
    total: data?.count || 0,
    nextPageUrl: data?.next || null,
    previousPageUrl: data?.previous || null,
    loading,
    isError,
    error
  };
};
