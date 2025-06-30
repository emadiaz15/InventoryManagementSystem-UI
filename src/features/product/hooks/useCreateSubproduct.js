import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubproduct } from "../services/createSubproduct";

export const useCreateSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => createSubproduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["subproducts", productId]);
    },
  });
};
