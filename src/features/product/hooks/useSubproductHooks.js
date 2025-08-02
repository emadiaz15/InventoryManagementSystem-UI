// src/features/product/hooks/useSubproductHooks.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listSubproducts,
  createSubproduct,
  updateSubproduct,
  deleteSubproduct,
} from "@/features/product/services/subproducts/subproducts"
import { productKeys } from "@/features/product/utils/queryKeys.js"

/**
 * 1️⃣ Listar subproductos (paginado) con prefetch automático.
 */
export function useListSubproducts(productId, pageUrl = null) {
  const qc = useQueryClient()
  const listKey = pageUrl
    ? productKeys.subproductList(productId, pageUrl)
    : productKeys.subproductList(productId)

  const query = useQuery({
    queryKey: listKey,
    queryFn: () => listSubproducts(productId, pageUrl),
    enabled: !!productId,
    keepPreviousData: true,
    staleTime: 5 * 60_000,
    cacheTime: 10 * 60_000,
    refetchOnWindowFocus: false,
  })

  // Prefetch siguiente página
  const prefetchPage = (nextUrl) => {
    if (!nextUrl) return
    const nextKey = productKeys.subproductList(productId, nextUrl)
    qc.prefetchQuery({
      queryKey: nextKey,
      queryFn: () => listSubproducts(productId, nextUrl),
    })
  }

  return {
    ...query,
    subproducts: query.data?.results || [],
    nextPageUrl: query.data?.next || null,
    previousPageUrl: query.data?.previous || null,
    prefetchPage,
  }
}

/**
 * 2️⃣ Crear subproducto con optimistic update.
 */
export function useCreateSubproduct(productId) {
  const qc = useQueryClient()
  const listKey = productKeys.subproductList(productId)

  return useMutation({
    mutationFn: (formData) => createSubproduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["subproducts"])

    },
  })
}

/**
 * 3️⃣ Actualizar subproducto con optimistic update.
 */
export function useUpdateSubproduct(productId) {
  const qc = useQueryClient()
  const listKey = productKeys.subproductList(productId)
  const detailKey = (subId) => productKeys.subproductDetail(productId, subId)

  return useMutation({
    mutationFn: ({ subproductId, formData }) =>
      updateSubproduct(productId, subproductId, formData),

    onMutate: async ({ subproductId, updates }) => {
      await qc.cancelQueries(listKey)

      const prevList = qc.getQueryData(listKey)
      const prevDetail = qc.getQueryData(detailKey(subproductId))

      qc.setQueryData(listKey, (old = prevList) => ({
        ...old,
        results: old.results.map((sp) =>
          sp.id === subproductId ? { ...sp, ...updates } : sp
        ),
      }))

      qc.setQueryData(detailKey(subproductId), (old = prevDetail) =>
        old ? { ...old, ...updates } : old
      )

      return { prevList, prevDetail }
    },

    onError: (_err, _vars, context) => {
      if (context?.prevList) {
        qc.setQueryData(listKey, context.prevList)
      }
      if (context?.prevDetail) {
        qc.setQueryData(detailKey(context.subproductId), context.prevDetail)
      }
    },

    onSettled: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          productKeys.prefixMatch(q.queryKey) &&
          q.queryKey[0] === "products" &&
          q.queryKey[2] === "subproducts" &&
          q.queryKey[1] === productId,
      })
    },
  });
}

/**
 * 4️⃣ Eliminar subproducto con optimistic update.
 */
export function useDeleteSubproduct(productId) {
  const qc = useQueryClient()
  const listKey = productKeys.subproductList(productId)

  return useMutation({
    mutationFn: (subproductId) => deleteSubproduct(productId, subproductId),
    onMutate: async (subproductId) => {
      await qc.cancelQueries(listKey)
      const previous = qc.getQueryData(listKey)

      qc.setQueryData(listKey, (old = previous) => ({
        ...old,
        results: old.results.filter((sp) => sp.id !== subproductId),
        count: old.count - 1,
      }))
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(listKey, context.previous)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          productKeys.prefixMatch(q.queryKey) &&
          q.queryKey[0] === "products" &&
          q.queryKey[2] === "subproducts" &&
          q.queryKey[1] === productId,
      })
    },
  })
}
