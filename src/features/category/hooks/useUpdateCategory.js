import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../services/updateCategory";

/**
 * Hook para actualizar una categoría existente.
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
