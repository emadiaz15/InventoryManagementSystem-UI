// src/features/product/hooks/useProductHooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/features/product/services/products/products.js"
import { productKeys } from "@/features/product/utils/queryKeys.js"

/**
 * Hook para CRUD de Productos con React Query
 * @param {Object} filters
 * @param {string|null} pageUrl
 */
export const useProducts = (filters = {}, pageUrl = null) => {
  const queryClient = useQueryClient()

  // URL de consulta o filtros
  const urlOrFilters = pageUrl || filters
  const listKey = pageUrl
    ? productKeys.list(filters, pageUrl)
    : productKeys.list(filters)

  // 1️⃣ Query de lista
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: listKey,
    queryFn: () => listProducts(urlOrFilters),
    keepPreviousData: true,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  // 2️⃣ Invalidator genérico
  const invalidateAll = () =>
    qc.invalidateQueries({
      predicate: (q) => productKeys.prefixMatch(q.queryKey),
    })

  // 3️⃣ Create optimista
  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"])
  })

  // 4️⃣ Update optimista
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries(["products"])
  })

  // 5️⃣ Delete optimista
  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"])
  })

  // 6️⃣ Prefetch
  const prefetchPage = (nextUrl) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.list(filters, nextUrl),
      queryFn: () => listProducts(nextUrl)

    })
  }

  return {
    products: data?.results || [],
    total: data?.count || 0,
    nextPageUrl: data?.next || null,
    previousPageUrl: data?.previous || null,
    loading: isLoading,
    isError,
    error,
    createProduct: createMut.mutateAsync,
    updateProduct: (id, payload) => updateMut.mutateAsync({ id, payload }),
    deleteProduct: (id) => deleteMut.mutateAsync(id),
    prefetchPage,
    status: {
      creating: createMut.status,
      updating: updateMut.status,
      deleting: deleteMut.status,
    },
  }
}
