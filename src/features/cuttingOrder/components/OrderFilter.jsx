import React, { useCallback } from "react";
import FormSelect from "../../../components/ui/form/FormSelect";
import DateFilter from "../../../components/common/DateFilter";

const OrderFilter = ({ filters = {}, onChange, onDateChange }) => {
    const handleInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            onChange({ ...filters, [name]: value });
        },
        [filters, onChange]
    );

    return (
        <div className="flex flex-col lg:flex-row w-full gap-4 pt-11">
            {/* 📅 Filtro de fecha a la izquierda */}
            <div className="min-w-fit">
                <DateFilter onFilterChange={(start, end) => {
                    const updatedFilters = {
                        ...filters,
                        start_date: start ? start.toISOString().split("T")[0] : "",
                        end_date: end ? end.toISOString().split("T")[0] : ""
                    };
                    onChange(updatedFilters);
                }} />
            </div>

            {/* 🧾 Filtros generales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                {/* Cliente */}
                <div>
                    <label htmlFor="client" className="block text-sm font-medium text-text-secondary">
                        Cliente
                    </label>
                    <input
                        id="client"
                        name="client"
                        type="text"
                        value={filters.client || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        placeholder="Buscar cliente"
                    />
                </div>

                {/* Número de Pedido */}
                <div>
                    <label htmlFor="order_number" className="block text-sm font-medium text-text-secondary">
                        Nro de Pedido
                    </label>
                    <input
                        id="order_number"
                        name="order_number"
                        type="text"
                        value={filters.order_number || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        placeholder="Ej: 1234"
                    />
                </div>

                {/* Estado */}
                <FormSelect
                    name="status"
                    label="Estado"
                    value={filters.status || ""}
                    onChange={handleInputChange}
                    options={[
                        { value: "", label: "Todos" },
                        { value: "pending", label: "Pendiente" },
                        { value: "in_process", label: "En proceso" },
                        { value: "completed", label: "Finalizado" },
                        { value: "cancelled", label: "Cancelado" },
                    ]}
                />
            </div>
        </div>
    );
};

export default OrderFilter;
