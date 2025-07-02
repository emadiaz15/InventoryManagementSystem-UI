import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubproduct } from "../services/deleteSubproduct";

export const useDeleteSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subpId) => deleteSubproduct(productId, subpId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "subproducts" && query.queryKey[1] === productId,
      });
    },
  });
};
