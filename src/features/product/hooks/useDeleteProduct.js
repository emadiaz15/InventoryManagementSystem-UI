import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/deleteProduct";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });
};
