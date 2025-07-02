import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../services/updateProduct";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productData }) => updateProduct(productId, productData),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "products",
      });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
};