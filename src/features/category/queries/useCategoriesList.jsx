import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listCategories } from '../services/listCategory';
import { createCategory } from '../services/createCategory';
import { updateCategory } from '../services/updateCategory';
import { buildQueryString } from '@/utils/queryUtils';

/**
 * Hook para manejar la lógica de consulta, paginación y mutaciones de categorías.
 * @param {object} filters - Filtros opcionales (ej: { name: "" })
 */
export const useCategoriesQuery = (filters = {}, initialUrl = '/inventory/categories/') => {
    const queryClient = useQueryClient();

    const queryString = buildQueryString(filters);
    const baseUrl = `${initialUrl.split("?")[0]}${queryString}`;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['categories', baseUrl],
        queryFn: () => listCategories(baseUrl),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
        },
    });

    const next = () => {
        if (data?.next) queryClient.prefetchQuery(['categories', data.next], () => listCategories(data.next));
    };

    const previous = () => {
        if (data?.previous) queryClient.prefetchQuery(['categories', data.previous], () => listCategories(data.previous));
    };

    return {
        categories: data?.results ?? [],
        loadingCategories: isLoading,
        error,
        nextPageUrl: data?.next,
        previousPageUrl: data?.previous,
        currentUrl: baseUrl,
        refetch,
        next,
        previous,
        createCategory: createMutation.mutate,
        updateCategory: updateMutation.mutate,
        createStatus: createMutation.status,
        updateStatus: updateMutation.status,
    };
};
