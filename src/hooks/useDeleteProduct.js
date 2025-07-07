import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/services/products";
import { productKeys } from "@/features/product/utils/queryKeys";

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

export default useDeleteProduct;
