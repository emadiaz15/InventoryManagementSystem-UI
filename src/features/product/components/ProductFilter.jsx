import React from "react";
import Filter from "../../../components/ui/Filter";

const ProductFilter = ({ onFilterChange }) => {
    const filterColumns = [
        { key: "name", label: "Nombre del Producto", filterable: true },
        { key: "category", label: "Categoría", filterable: true },
        {
            key: "status", label: "Estado", filterable: true, options: [
                { value: "", label: "Todos" },
                { value: "Disponible", label: "Disponible" },
                { value: "Agotado", label: "Agotado" },
            ]
        },
    ];

    return <Filter columns={filterColumns} onFilterChange={onFilterChange} />;
};

export default ProductFilter;
