import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory as createCategoryApi,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
} from "../services/categories";

/**
 * Añade la nueva categoría al principio del cache de la página 1.
 */
function insertInPage1Cache(qc, newCat) {
  // Cambia page_size si usás otro valor por defecto
  qc.setQueryData(["categories", { name: "", page: 1, page_size: 10 }], old => {
    if (!old) return old;
    // Evita duplicados si ya está
    if (old.results.some(cat => cat.id === newCat.id)) return old;
    return {
      ...old,
      results: [newCat, ...old.results].slice(0, old.results.length), // Respeta el page_size
      count: old.count + 1,
    };
  });
}

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategoryApi,
    onSuccess: (newCat) => {
      insertInPage1Cache(qc, newCat);
      // Invalida queries para refetch otras páginas/combos
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["prefetch", "categories"] });
      // Fuerza refetch inmediato de todas las queries de categorías (TanStack v5 pattern)
      qc.refetchQueries({ queryKey: ["categories"] });
      qc.refetchQueries({ queryKey: ["prefetch", "categories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCategoryApi(id, payload),
    onSuccess: (updatedCat) => {
      // Busca y reemplaza en TODAS las páginas cacheadas de categorías
      qc.getQueryCache().findAll(["categories"]).forEach(query => {
        qc.setQueryData(query.queryKey, old => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map(cat =>
              cat.id === updatedCat.id ? updatedCat : cat
            ),
          };
        });
      });
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["prefetch", "categories"] });
      qc.refetchQueries({ queryKey: ["categories"] });
      qc.refetchQueries({ queryKey: ["prefetch", "categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategoryApi(id),
    onSuccess: (_resp, id) => {
      // Remueve de todas las páginas cacheadas de categorías
      qc.getQueryCache().findAll(["categories"]).forEach(query => {
        qc.setQueryData(query.queryKey, old => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.filter(cat => cat.id !== id),
            count: old.count > 0 ? old.count - 1 : 0,
          };
        });
      });
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["prefetch", "categories"] });
      qc.refetchQueries({ queryKey: ["categories"] });
      qc.refetchQueries({ queryKey: ["prefetch", "categories"] });
    },
  });
};
