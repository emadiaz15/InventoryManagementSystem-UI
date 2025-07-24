import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import { listCategories } from "@/features/category/services/categories";
import { listTypes } from "@/features/type/services/types";

const ProductFilter = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState({
        code: filters.code || "",
        category: filters.category || "",
        type: filters.type || "",
    });
    // Categories query
    const {
        data: catPage = {},
        isLoading: loadingCategories,
    } = useQuery({
        queryKey: ["categories", { limit: 1000, status: true }],
        queryFn: () => listCategories({ limit: 1000, status: true }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const categories = catPage.results || [];

    // Types query (depends on category)
    const {
        data: typePage = {},
        isLoading: loadingTypes,
    } = useQuery({
        queryKey: [
            "types",
            { limit: 1000, status: true, category: localFilters.category },
        ],
        queryFn: () =>
            listTypes({
                limit: 1000,
                status: true,
                category: localFilters.category,
            }),
        enabled: !!localFilters.category,
        staleTime: 5 * 60 * 1000,
    });
    const types = typePage.results || [];

    // Reset type filter when category changes to empty
    useEffect(() => {
        if (!localFilters.category) {
            setLocalFilters((prev) => ({ ...prev, type: "" }));
        }
    }, [localFilters.category]);

    // Notificar cambios al padre cuando localFilters cambie
    useEffect(() => {
        onFilterChange(localFilters);
    }, [localFilters, onFilterChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            {/* Filtro por código */}
            <div className="flex-1 min-w-[200px]">
                <FormInput
                    label="Código"
                    name="code"
                    type="number"
                    value={localFilters.code}
                    onChange={handleChange}
                    placeholder="Filtrar código"
                />
            </div>

            {/* Filtro por categoría */}
            <div className="flex-1 min-w-[200px]">
                <FormSelect
                    label="Categoría"
                    name="category"
                    value={localFilters.category}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Todas" },
                        ...categories.map((c) => ({ value: String(c.id), label: c.name })),
                    ]}
                    loading={loadingCategories}
                />
            </div>

            {/* Filtro por tipo (depende de categoría) */}
            <div className="flex-1 min-w-[200px]">
                <FormSelect
                    label="Tipo"
                    name="type"
                    value={localFilters.type}
                    onChange={handleChange}
                    options={[
                        { value: "", label: "Todos" },
                        ...types.map((t) => ({ value: String(t.id), label: t.name })),
                    ]}
                    disabled={!localFilters.category || loadingTypes}
                    loading={loadingTypes}
                />
            </div>
        </div>
    );
};

export default ProductFilter;
