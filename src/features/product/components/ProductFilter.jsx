// src/features/product/components/ProductFilter.jsx
import React, { useState, useEffect } from "react";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import { listCategories } from "@/features/category/services/listCategory";
import { listTypes } from "@/features/type/services/listType";

const ProductFilter = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState({
        code: filters.code || "",
        category: filters.category || "",
        type: filters.type || "",
    });
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    // Carga todas las categorías al montar
    useEffect(() => {
        listCategories("/inventory/categories/?limit=1000&status=true")
            .then(res => setCategories(res.results || []))
            .catch(err => console.error("Error cargando categorías:", err));
    }, []);

    // Cuando cambia la categoría, recarga los tipos y resetea el filtro 'type'
    useEffect(() => {
        const catId = localFilters.category;
        if (!catId) {
            setTypes([]);
            // Reseteamos 'type' tanto local como en el padre
            setLocalFilters(prev => {
                const updated = { ...prev, type: "" };
                onFilterChange(updated);
                return updated;
            });
            return;
        }

        listTypes(`/inventory/types/?limit=1000&status=true&category=${catId}`)
            .then(res => setTypes(res.results || []))
            .catch(err => console.error("Error cargando tipos:", err));
    }, [localFilters.category, onFilterChange]); // <-- agregamos onFilterChange

    const handleChange = e => {
        const { name, value } = e.target;
        const updated = { ...localFilters, [name]: value };
        setLocalFilters(updated);
        onFilterChange(updated);
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
                        ...categories.map(c => ({ value: String(c.id), label: c.name }))
                    ]}
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
                        ...types.map(t => ({ value: String(t.id), label: t.name }))
                    ]}
                    disabled={!localFilters.category}
                />
            </div>
        </div>
    );
};

export default ProductFilter;
