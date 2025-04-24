import React, { useCallback } from "react";
import FormSelect from "../../../components/ui/form/FormSelect";

const UserFilters = ({ filters, onChange }) => {
    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            onChange({ ...filters, [name]: value });
        },
        [filters, onChange]
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Filtro por Nombre y Apellido */}
            <div>
                <label
                    className="block text-sm font-medium text-text-secondary"
                    htmlFor="full_name_filter"
                >
                    Nombre y Apellido
                </label>
                <input
                    id="full_name_filter"
                    name="full_name"
                    type="text"
                    placeholder="Buscar por nombre"
                    value={filters.full_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
            </div>

            {/* Filtro por DNI (fix en el ID para evitar conflicto) */}
            <div>
                <label
                    className="block text-sm font-medium text-text-secondary"
                    htmlFor="dni_filter"
                >
                    DNI
                </label>
                <input
                    id="dni_filter"
                    name="dni"
                    type="text"
                    placeholder="Buscar por DNI"
                    value={filters.dni}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
            </div>

            {/* Filtro por Rol */}
            <FormSelect
                name="is_staff"
                label="Rol"
                value={filters.is_staff || ""}
                onChange={handleInputChange}
                options={[
                    { value: "", label: "Todos" },
                    { value: "true", label: "Administrador" },
                    { value: "false", label: "Operario" },
                ]}
            />
        </div>
    );
};

export default UserFilters;
