import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listCategories } from '../services/listCategory';
import { createCategory } from '../services/createCategory';
import { updateCategory } from '../services/updateCategory';

const buildQueryString = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    return params.toString() ? `?${params.toString()}` : '';
};

export const useCategoriesQuery = (filters, initialUrl = '/inventory/categories/') => {
    const queryClient = useQueryClient();
    const [currentUrl, setCurrentUrl] = useState(
        `${initialUrl}${buildQueryString(filters)}`
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['categories', currentUrl],
        queryFn: () => listCategories(currentUrl),
        keepPreviousData: true,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => queryClient.invalidateQueries(['categories']),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateCategory(id, data),
        onSuccess: () => queryClient.invalidateQueries(['categories']),
    });

    const fetchCategories = (url) => {
        setCurrentUrl(url);
    };

    const next = () => {
        if (data?.next) setCurrentUrl(data.next);
    };

    const previous = () => {
        if (data?.previous) setCurrentUrl(data.previous);
    };

    return {
        categories: data?.results ?? [],
        loadingCategories: isLoading,
        error,
        nextPageUrl: data?.next,
        previousPageUrl: data?.previous,
        fetchCategories,
        next,
        previous,
        currentUrl,
        createMutation,
        updateMutation,
    };
};