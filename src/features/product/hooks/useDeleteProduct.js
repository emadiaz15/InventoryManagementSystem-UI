import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/deleteProduct";
import { productKeys } from "../utils/queryKeys";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => productKeys.prefixMatch(query.queryKey),
      });
    },
  });
};
