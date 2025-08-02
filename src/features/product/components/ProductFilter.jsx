import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/features/category/services/categories";
import { listTypes } from "@/features/type/services/types";
import { useDebouncedEffect } from "@/features/product/hooks/useDebouncedEffect";

const ProductFilter = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState({
        code: filters.code || "",
        category: filters.category || "",
        type: filters.type || "",
    });

    // 🔍 Categorías
    const { data: catPage = {}, isLoading: loadingCategories } = useQuery({
        queryKey: ["categories", { limit: 1000, status: true }],
        queryFn: () => listCategories({ limit: 1000, status: true }),
        staleTime: 5 * 60 * 1000,
    });
    const categories = useMemo(() => catPage?.results ?? [], [catPage]);

    // 🔍 Tipos dependientes de categoría
    const { data: typePage = {}, isLoading: loadingTypes } = useQuery({
        queryKey: ["types", { limit: 1000, status: true, category: localFilters.category }],
        queryFn: () => listTypes({ limit: 1000, status: true, category: localFilters.category }),
        enabled: !!localFilters.category,
        staleTime: 5 * 60 * 1000,
    });
    const types = useMemo(() => typePage?.results ?? [], [typePage]);

    const categoryOptions = useMemo(() => categories.map((c) => ({ value: c.name })), [categories]);
    const typeOptions = useMemo(() => types.map((t) => ({ value: t.name })), [types]);

    // 🔄 Si se borra categoría, borrar tipo también
    useEffect(() => {
        if (!localFilters.category) {
            setLocalFilters((prev) => ({ ...prev, type: "" }));
        }
    }, [localFilters.category]);

    // ✅ Validación + emisión con delay (300ms)
    useDebouncedEffect(() => {
        const clean = { ...localFilters };

        if (clean.code && !/^\d+$/.test(clean.code)) {
            return; // No emitimos si el código no es numérico
        }

        onFilterChange(clean);
    }, 300, [localFilters, onFilterChange]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    const fields = [
        { key: "code", label: "Código", inputMode: "numeric", disabled: false },
        { key: "category", label: "Categoría", datalist: "category-options", disabled: false },
        { key: "type", label: "Tipo", datalist: "type-options", disabled: !localFilters.category || loadingTypes },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {fields.map((field) => (
                <div key={field.key} className="mb-2">
                    <label htmlFor={field.key} className="block text-sm font-medium text-text-secondary">
                        {field.label}
                    </label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            name={field.key}
                            id={field.key}
                            inputMode={field.inputMode || "text"}
                            list={field.datalist}
                            placeholder={`Filtrar ${field.label}`}
                            value={localFilters[field.key]}
                            onChange={handleChange}
                            disabled={field.disabled}
                            className="pl-9 pr-2 py-1.5 text-sm block w-full border border-gray-300 bg-white text-text-primary rounded-md shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:opacity-50"
                        />
                        {field.key === "category" && (
                            <datalist id="category-options">
                                {categoryOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} />
                                ))}
                            </datalist>
                        )}
                        {field.key === "type" && (
                            <datalist id="type-options">
                                {typeOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value} />
                                ))}
                            </datalist>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductFilter;
