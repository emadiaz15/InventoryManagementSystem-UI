import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubproduct } from "../services/updateSubproduct";

export const useUpdateSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subproductId, formData }) =>
      updateSubproduct(productId, subproductId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "subproducts" && query.queryKey[1] === productId,
      });
    },
  });
};
