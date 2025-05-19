import React, { useCallback } from "react";
import FormSelect from "../../../components/ui/form/FormSelect";

const SubproductFilters = ({ filters, onChange }) => {
    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            onChange({ ...filters, [name]: value });
        },
        [filters, onChange]
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Filtro por Estado */}
            <FormSelect
                name="status"
                label="Estado"
                value={filters.status}
                onChange={handleInputChange}
                options={[
                    { value: "true", label: "Disponible" },
                    { value: "false", label: "Terminada" },
                ]}
            />
        </div>
    );
};

export default SubproductFilters;
