import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubproduct } from "../services/createSubproduct";

export const useCreateSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => createSubproduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "subproducts" && query.queryKey[1] === productId,
      });
    },
  });
};
