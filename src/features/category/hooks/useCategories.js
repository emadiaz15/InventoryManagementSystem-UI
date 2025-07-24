// src/features/category/hooks/useCategories.js
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { djangoApi } from "@/api/clients"
import { buildQueryString } from "@/utils/queryUtils"

export const useCategories = (filters = {}) => {
  const qc = useQueryClient()
  const qs = buildQueryString(filters)
  const endpoint = `/inventory/categories/${qs}`

  // 📄 Listado
  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => djangoApi.get(endpoint).then((res) => res.data),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // Función genérica para invalidar TODO lo que empiece por "categories"
  const invalidateAll = () =>
    qc.invalidateQueries({
      predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "categories",
    })

  // ➕ Crear
  const createCategory = useMutation({
    mutationFn: (payload) =>
      djangoApi.post("/inventory/categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
    },
  })

  // ✏️ Actualizar
  const updateCategory = useMutation({
    mutationFn: ({ id, payload }) =>
      djangoApi.put(`/inventory/categories/${id}/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
    },

  })

  // 🗑️ Borrar
  const deleteCategory = useMutation({
    mutationFn: (id) =>
      djangoApi.delete(`/inventory/categories/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"])
    },

  })

  // 🔮 Prefetch de páginas
  const prefetchPage = (pageUrl) => {
    if (!pageUrl) return
    qc.prefetchQuery({
      queryKey: ["categories", pageUrl],
      queryFn: () => djangoApi.get(pageUrl).then((res) => res.data),
    })
  }

  return {
    // datos
    categories: data?.results || [],
    total: data?.count ?? 0,
    nextPageUrl: data?.next ?? null,
    previousPageUrl: data?.previous ?? null,

    // estados
    loading,
    isError,
    error,
    prefetchPage
  }
}
