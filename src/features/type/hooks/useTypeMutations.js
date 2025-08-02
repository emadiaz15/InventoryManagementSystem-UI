// src/features/type/hooks/useTypeMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createType,
  updateType,
  deleteType
} from "@/features/type/services/types";

export const useCreateType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createType,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["types"] })
  });
};

export const useUpdateType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateType(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["types"] })
  });
};

export const useDeleteType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteType,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["types"] })
  });
};
