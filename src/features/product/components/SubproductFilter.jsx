import React, { useCallback } from "react";
import StatusSelect from "./StatusSelect";

const SubproductFilters = ({ filters, onChange }) => {
    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            onChange({ ...filters, [name]: value });
        },
        [filters, onChange]
    );

    const options = [
        {
            value: "true",
            label: (
                <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Disponible
                </div>
            ),
        },
        {
            value: "false",
            label: (
                <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2" />
                    Terminada
                </div>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatusSelect
                name="status"
                label="Estado"
                value={filters.status}
                onChange={handleInputChange}
                options={options}
            />
        </div>
    );
};

export default SubproductFilters;
