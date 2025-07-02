import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listProducts } from "../services/listProducts";
import { buildQueryString } from "@/utils/queryUtils";
import logger from "@/utils/logger";

/**
 * 📦 Hook para gestionar productos con filtros, paginación y cache optimizado.
 * TTL de 5 min, invalidación manual habilitada.
 *
 * @param {Object} filters - Filtros opcionales para la consulta.
 * @param {string} pageUrl - URL de paginación, si aplica.
 */
const useProducts = (filters = {}, pageUrl = null) => {
  const queryClient = useQueryClient();

  const queryString = buildQueryString(filters);
  const baseUrl = "/inventory/products/";
  const url = pageUrl || `${baseUrl}${queryString}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filters, pageUrl],
    queryFn: async () => {
      logger.log(`📡 Consultando productos desde: ${url}`);
      const data = await listProducts(url);
      if (!data || !Array.isArray(data.results)) {
        throw new Error("Respuesta inesperada de la API.");
      }
      return data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 min TTL
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return {
    products: data?.results || [],
    loadingProducts: isLoading,
    error,
    nextPageUrl: data?.next || null,
    previousPageUrl: data?.previous || null,
    invalidate,
  };
};

export default useProducts;
