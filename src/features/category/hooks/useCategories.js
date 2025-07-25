import { useQuery } from "@tanstack/react-query"
import { djangoApi } from "@/api/clients"
import { buildQueryString } from "@/utils/queryUtils"

/**
 * Named export ✅
 */
export function useCategories(filters = {}) {
  const qs = buildQueryString(filters)
  const endpoint = `/inventory/categories/${qs}`

  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories", filters],
    queryFn: () => djangoApi.get(endpoint).then((res) => res.data),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  return {
    categories: data?.results || [],
    total: data?.count ?? 0,
    nextPageUrl: data?.next ?? null,
    previousPageUrl: data?.previous ?? null,
    loading,
    isError,
    error,
  }
}
