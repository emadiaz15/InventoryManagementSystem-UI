import { useQuery } from "@tanstack/react-query";
import { listCategories } from "../services/listCategories";

/**
 * Hook para obtener la lista de categorías.
 * @param {string} url - Ruta opcional para paginación.
 */
export const useCategories = (url = "/inventory/categories/") => {
  return useQuery({
    queryKey: ["categories", url],
    queryFn: () => listCategories(url),
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
