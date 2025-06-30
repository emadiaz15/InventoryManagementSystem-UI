import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listCategories } from '../services/listCategory';
import { createCategory } from '../services/createCategory';
import { updateCategory } from '../services/updateCategory';
import { deleteCategory } from '../services/deleteCategory';
import { buildQueryString } from '@/utils/queryUtils';
import {
    getCachedCategories,
    setCachedCategories,
    invalidateCachedCategoriesByUrl
} from '../services/categoryCache';

export const useCategoriesQuery = (filters = {}, initialUrl = '/inventory/categories/') => {
    const queryClient = useQueryClient();

    const queryString = buildQueryString(filters);
    const baseUrl = `${initialUrl.split("?")[0]}${queryString}`;

    const cachedData = getCachedCategories(baseUrl);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['categories', baseUrl],
        queryFn: async () => {
            if (cachedData) return cachedData;
            const apiData = await listCategories(baseUrl);
            setCachedCategories(baseUrl, apiData);
            return apiData;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 5,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            invalidateCachedCategoriesByUrl(baseUrl);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            invalidateCachedCategoriesByUrl(baseUrl);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            invalidateCachedCategoriesByUrl(baseUrl);
        },
    });

    const next = () => {
        if (data?.next) {
            queryClient.prefetchQuery(['categories', data.next], () => listCategories(data.next));
        }
    };

    const previous = () => {
        if (data?.previous) {
            queryClient.prefetchQuery(['categories', data.previous], () => listCategories(data.previous));
        }
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
        createCategory: createMutation.mutateAsync,
        updateCategory: (id, data) => updateMutation.mutateAsync({ id, ...data }),
        deleteCategory: deleteMutation.mutateAsync,
        createStatus: createMutation.status,
        updateStatus: updateMutation.status,
    };
};
