import { useQuery } from "@tanstack/react-query";
import { listSubproducts } from "../services/listSubproducts";
import { buildQueryString } from "@/utils/queryUtils";

/**
 * Hook para obtener subproductos de un producto con filtros y paginación, optimizado con React Query.
 * @param {string|number} productId - ID del producto padre
 * @param {object} filters - Objeto de filtros (ej: { status: 'true', page_size: 8 })
 */
export const useSubproducts = (productId, filters = { page_size: 8, status: "true" }) => {
  const queryString = buildQueryString(filters);
  const fullUrl = `/inventory/products/${productId}/subproducts/${queryString}`;

  return useQuery({
    queryKey: ["subproducts", productId, filters],
    queryFn: () => listSubproducts(productId, fullUrl),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,     // 5 minutos
    cacheTime: 1000 * 60 * 10,    // permanece en caché 10 minutos si no se usa
    keepPreviousData: true,       // mantiene los datos previos en paginación
    refetchOnWindowFocus: false,  // evita refetch al volver al tab
  });
};
