import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "@/features/product/services/products/products.js"
import { buildQueryString } from "@/utils/queryUtils"
import { productKeys } from "@/features/product/utils/queryKeys"

const BASE_URL = "/inventory/products/"

/**
 * Hook para listar y paginar productos, y exponer estados de carga/errores.
 * @param {Object} filters  { name, category, type, page, page_size, status, ... }
 * @param {string|null} pageUrl URL absoluta de next/previous page (opcional)
 */
export const useProducts = (filters = {}, pageUrl = null) => {
  const queryClient = useQueryClient()

  // URL de consulta o filtros
  const urlOrFilters = pageUrl || filters

  // Clave de cache: incluye URL o filtros
  const queryKey = pageUrl
    ? productKeys.list(filters, pageUrl)
    : productKeys.list(filters)

  // Query principal (v5 object signature)
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey,
    queryFn: () => listProducts(urlOrFilters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })

  // 🤝 Mutations v5
  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"])
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateProduct(id, payload),
    onSuccess: () => queryClient.invalidateQueries(["products"])
  })

  const deleteMut = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries(["products"])
  })

  // Prefetch de la siguiente/previa página (v5 prefetchQuery object signature)
  const prefetchPage = (nextUrl) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.list(filters, nextUrl),
      queryFn: () => listProducts(nextUrl)
    })
  }

  return {
    // Datos
    products: data?.results     || [],
    total:    data?.count       || 0,
    nextPageUrl:     data?.next     || null,
    previousPageUrl: data?.previous || null,

    // Estados
    loading: isLoading,
    isError,
    error,

    // CRUD
    createProduct: createMut.mutateAsync,
    updateProduct: (id, payload) => updateMut.mutateAsync({ id, payload }),
    deleteProduct: deleteMut.mutateAsync,

    status: {
      creating: createMut.status,
      updating: updateMut.status,
      deleting: deleteMut.status
    },

    prefetchPage
  }
}
