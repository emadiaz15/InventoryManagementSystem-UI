import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@feature/product/services/products";
import { productKeys } from "@/features/product/utils/queryKeys";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        predicate: (query) => productKeys.prefixMatch(query.queryKey),
      });
      if (productId) {
        queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      }
    },
  });
};

export default useUpdateProduct;
