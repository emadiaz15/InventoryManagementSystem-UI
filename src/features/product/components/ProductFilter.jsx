import React, { useState, useEffect } from "react";
import Filter from "../../../components/ui/Filter";

const ProductFilter = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters); // sincroniza si cambian desde afuera
    }, [filters]);

    const handleChange = (updated) => {
        setLocalFilters(updated);
        onFilterChange(updated);
    };

    const filterColumns = [
        {
            key: "code",
            label: "Código",
            filterable: true,
            type: "number",
        },
    ];

    return (
        <Filter
            columns={filterColumns}
            filters={localFilters}
            onFilterChange={handleChange}
        />
    );
};

export default ProductFilter;
