// src/features/type/hooks/useTypes.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listTypes,
  createType,
  updateType,
  deleteType
} from "@/features/type/services/types"

/**
 * Hook para listado y mutaciones de Tipos
 * @param {Object} filters { name, page, page_size, status, category, ... }
 */
export const useTypes = (filters = {}) => {
  const queryClient = useQueryClient()

  // 👉 Fetch de lista
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
  })

  // 👉 Mutations
  const createMut = useMutation({
    mutationFn: createType,
    onSuccess: () => queryClient.invalidateQueries(["types"])
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateType(id, payload),
    onSuccess: () => queryClient.invalidateQueries(["types"])
  })

  const deleteMut = useMutation({
    mutationFn: deleteType,
    onSuccess: () => queryClient.invalidateQueries(["types"])
  })

  // 👉 Prefetch de paginación (si lo necesitas)
  const prefetchPage = (nextFilters) => {
    queryClient.prefetchQuery({
      queryKey: ["types", nextFilters],
      queryFn: () => listTypes(nextFilters)
    })
  }

  return {
    // Datos
    types: data?.results || [],
    total: data?.count || 0,
    nextPageUrl: data?.next || null,
    previousPageUrl: data?.previous || null,
    loading,
    isError,
    error,

    // CRUD
    createType: createMut.mutateAsync,
    updateType: (id, payload) => updateMut.mutateAsync({ id, payload }),
    deleteType: deleteMut.mutateAsync,

    // Estados de las mutaciones
    status: {
      create: createMut.status,
      update: updateMut.status,
      delete: deleteMut.status
    },

    prefetchPage
  }
}
