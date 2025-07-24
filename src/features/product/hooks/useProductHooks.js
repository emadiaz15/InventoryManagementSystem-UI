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
  const qc = useQueryClient()
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
    onMutate: async (newProd) => {
      await qc.cancelQueries(listKey)
      const previous = qc.getQueryData(listKey)
      const tempId = `tmp-${Math.random().toString(36).substr(2, 9)}`
      qc.setQueryData(listKey, (old) => ({
        ...old,
        results: [
          { id: tempId, current_stock: newProd.initial_stock_quantity ?? 0, ...newProd },
          ...(old?.results ?? []),
        ],
        count: (old?.count ?? 0) + 1,
      }))
      return { previous }
    },
    onError: (_err, _newProd, context) => {
      if (context?.previous) qc.setQueryData(listKey, context.previous)
    },
    onSettled: () => {
      invalidateAll()
    },
  })

  // 4️⃣ Update optimista
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onMutate: async ({ id, payload }) => {
      await Promise.all([
        qc.cancelQueries(listKey),
        qc.cancelQueries({ queryKey: productKeys.detail(id) }),
      ])
      const prevList = qc.getQueryData(listKey)
      const prevDetail = qc.getQueryData(productKeys.detail(id))
      qc.setQueryData(listKey, (old) => ({
        ...old,
        results: (old?.results ?? []).map((p) =>
          p.id === id ? { ...p, ...payload } : p
        ),
      }))
      qc.setQueryData(productKeys.detail(id), (old) =>
        old ? { ...old, ...payload } : old
      )
      return { prevList, prevDetail }
    },
    onError: (_err, vars, context) => {
      if (context?.prevList) qc.setQueryData(listKey, context.prevList)
      if (context?.prevDetail)
        qc.setQueryData(productKeys.detail(vars.id), context.prevDetail)
    },
    onSettled: () => {
      invalidateAll()
    },
  })

  // 5️⃣ Delete optimista
  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onMutate: async (id) => {
      await qc.cancelQueries(listKey)
      const previous = qc.getQueryData(listKey)
      qc.setQueryData(listKey, (old) => ({
        ...old,
        results: (old?.results ?? []).filter((p) => p.id !== id),
        count: (old?.count ?? 0) - 1,
      }))
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(listKey, context.previous)
    },
    onSettled: () => {
      invalidateAll()
    },
  })

  // 6️⃣ Prefetch
  const prefetchPage = (nextUrl) => {
    const nextKey = productKeys.list(filters, nextUrl)
    qc.prefetchQuery({
      queryKey: nextKey,
      queryFn: () => listProducts(nextUrl),
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
