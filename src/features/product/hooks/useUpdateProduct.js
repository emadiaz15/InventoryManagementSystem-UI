import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/updateProduct";
import { productKeys } from "../utils/queryKeys";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => productKeys.prefixMatch(query.queryKey),
      });
    },
  });
};
