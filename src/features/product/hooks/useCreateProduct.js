import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../services/createProduct";
import { productKeys } from "../utils/queryKeys";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => productKeys.prefixMatch(query.queryKey),
      });
    },
  });
};
