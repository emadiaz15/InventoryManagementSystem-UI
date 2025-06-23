import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../services/listProducts";
import { useAuth } from "../../../context/AuthProvider";
import { buildQueryString } from "@/utils/queryUtils";

/**
 * Hook optimizado con React Query para obtener productos con filtros y cache TTL.
 * @param {object} filters - Objeto de filtros (ej: { status: 'true', page_size: 20 })
 * @param {string} baseUrl - Endpoint base, por defecto /inventory/products/
 */
export const useProducts = (filters = {}, baseUrl = "/inventory/products/") => {
  const { isAuthenticated } = useAuth();
  const queryString = buildQueryString(filters);
  const fullUrl = `${baseUrl}${queryString}`;

  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => {
      if (!isAuthenticated) {
        return Promise.reject(new Error("No estás autenticado"));
      }
      return listProducts(fullUrl);
    },
    enabled: !!isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutos (TTL)
    cacheTime: 1000 * 60 * 10, // permanece en caché por 10 minutos si no se usa
    keepPreviousData: true,    // mantiene la data previa durante el refetch
    refetchOnWindowFocus: false, // evita refetch innecesario al volver al tab
  });
};
