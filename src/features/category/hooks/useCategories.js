// src/features/category/hooks/useCategories.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { djangoApi } from "@/api/clients"
import { buildQueryString } from "@/utils/queryUtils"

export const useCategories = (filters = {}) => {
  const queryClient = useQueryClient()
  const qs = buildQueryString(filters)
  const endpoint = `/inventory/categories/${qs}`

  // LISTADO
  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => djangoApi.get(endpoint).then(res => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,   // 5 min fresco
    cacheTime: 1000 * 60 * 10,  // 10 min en caché
    refetchOnWindowFocus: false,
  })

  // MUTATIONS
  const createCategory = useMutation({
    mutationFn: (payload) =>
      djangoApi.post("/inventory/categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
    },
  })

  const updateCategory = useMutation({
    mutationFn: ({ id, payload }) =>
      djangoApi.put(`/inventory/categories/${id}/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
    },
  })

  const deleteCategory = useMutation({
    mutationFn: (id) =>
      djangoApi.delete(`/inventory/categories/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
    },
  })

  // PREFETCH de páginas
  const prefetchPage = (pageUrl) => {
    if (pageUrl) {
      queryClient.prefetchQuery({
        queryKey: ["categories", pageUrl],
        queryFn: () => djangoApi.get(pageUrl).then(res => res.data),
      })
    }
  }

  return {
    categories: data?.results || [],
    total: data?.count ?? 0,
    nextPageUrl: data?.next ?? null,
    previousPageUrl: data?.previous ?? null,
    loading,
    isError,
    error,
    createCategory: createCategory.mutateAsync,
    updateCategory: updateCategory.mutateAsync,
    deleteCategory: deleteCategory.mutateAsync,
    createStatus: createCategory.status,
    updateStatus: updateCategory.status,
    deleteStatus: deleteCategory.status,
    prefetchPage,
  }
}
