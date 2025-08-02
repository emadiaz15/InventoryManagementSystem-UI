// src/features/category/hooks/useCategoryMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories";
import { categoryKeys } from "../utils/queryKeys"

const updateAllCategoryPages = (qc, updateFn) => {
  qc.getQueryCache()
    .findAll(categoryKeys.all)
    .forEach((query) => {
      qc.setQueryData(query.queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          results: updateFn(old.results),
        };
      });
    });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: (newCat) => {
      qc.setQueryData(
        categoryKeys.list({ name: "", page: 1, page_size: 10 }),
        (old) => {
          if (!old) return old;
          if (old.results.some((c) => c.id === newCat.id)) return old;
          return {
            ...old,
            results: [newCat, ...old.results].slice(0, old.results.length),
            count: old.count + 1,
          };
        }
      );

      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.prefetch() });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateCategory(id, payload),
    onSuccess: (updatedCat) => {
      updateAllCategoryPages(qc, (cats) =>
        cats.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
      );

      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.prefetch() });
    },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: (_resp, id) => {
      updateAllCategoryPages(qc, (cats) =>
        cats.filter((cat) => cat.id !== id)
      );

      qc.invalidateQueries({ queryKey: categoryKeys.list() });
      qc.invalidateQueries({ queryKey: categoryKeys.prefetch() });
    },
  });
};
