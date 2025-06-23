import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listTypes } from "../services/listType";
import { createType } from "../services/createType";
import { updateType } from "../services/updateType";
import { deleteType } from "../services/deleteType";
import { buildQueryString } from "@/utils/queryUtils";

export const useTypesQuery = (filters = {}, initialUrl = "/inventory/types/") => {
  const queryClient = useQueryClient();

  const queryString = buildQueryString(filters);
  const fullUrl = `${initialUrl.split("?")[0]}${queryString}`;

  const { data, isLoading, error } = useQuery({
    queryKey: ["types", fullUrl],
    queryFn: () => listTypes(fullUrl),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: createType,
    onSuccess: () => queryClient.invalidateQueries(["types"]),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateType(id, data),
    onSuccess: () => queryClient.invalidateQueries(["types"]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteType(id),
    onSuccess: () => queryClient.invalidateQueries(["types"]),
  });

  return {
    types: data?.results ?? [],
    loadingTypes: isLoading,
    error,
    nextPageUrl: data?.next,
    previousPageUrl: data?.previous,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
