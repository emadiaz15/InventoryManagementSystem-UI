import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts } from "../services/listProducts";
import { buildQueryString } from "@/utils/queryUtils";
import logger from "@/utils/logger";

/**
 * 📦 Hook para gestionar la lista de productos con filtros y paginación usando React Query.
 *
 * @param {Object} filters - Filtros aplicados a la consulta.
 * @param {string} initialUrl - Endpoint inicial de la API.
 */
const useProducts = (filters = {}, initialUrl = "/inventory/products/") => {
  const queryClient = useQueryClient();

  const queryString = buildQueryString(filters);
  const url = `${initialUrl.split("?")[0]}${queryString}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", url],
    queryFn: async () => {
      logger.log(`📡 Consultando productos desde: ${url}`);
      const data = await listProducts(url);
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Respuesta inesperada de la API.");
      }
      return data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutos de TTL como definimos en la estrategia
  });

  const invalidate = () => {
    queryClient.invalidateQueries(["products"]);
  };

  return {
    products: data?.results || [],
    loadingProducts: isLoading,
    error,
    nextPageUrl: data?.next || null,
    previousPageUrl: data?.previous || null,
    currentUrl: url,
    invalidate,
  };
};

export default useProducts;
