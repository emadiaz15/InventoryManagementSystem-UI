import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/createCategory";

/**
 * Hook para crear una categoría.
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
    },
  });
};
