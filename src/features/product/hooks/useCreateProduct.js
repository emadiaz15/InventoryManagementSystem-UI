import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/createProduct";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};
