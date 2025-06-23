import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../services/deleteCategory";

/**
 * Hook para eliminar una categoría.
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
