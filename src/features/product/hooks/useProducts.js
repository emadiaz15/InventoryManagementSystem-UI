import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts } from "@feature/product/services/products";
import { buildQueryString } from "@/utils/queryUtils";
import { productKeys } from "@/features/product/utils/queryKeys";
import logger from "@/utils/logger";

export const useProducts = (filters = {}, pageUrl = null) => {
  const queryClient = useQueryClient();
  const queryString = buildQueryString(filters);
  const baseUrl = "/inventory/products/";
  const url = pageUrl || `${baseUrl}${queryString}`;

  const query = useQuery({
    queryKey: productKeys.list(filters, pageUrl),
    queryFn: async () => {
      logger.log(`📡 Consultando productos desde: ${url}`);
      const data = await listProducts(url);
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Respuesta inesperada de la API.");
      }
      return data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      predicate: (query) => productKeys.prefixMatch(query.queryKey),
    });
  };

  return {
    products: query.data?.results || [],
    loadingProducts: query.isLoading,
    error: query.error,
    nextPageUrl: query.data?.next || null,
    previousPageUrl: query.data?.previous || null,
    invalidate,
  };
};

export default useProducts;
