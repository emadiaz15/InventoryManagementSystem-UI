import React from "react";
import Filter from "../../../components/ui/Filter";

const OrderFilter = ({ onFilterChange, onDateChange }) => {
    const filterColumns = [
        { key: "client", label: "Cliente", filterable: true },
        { key: "assigned_by", label: "Asignado por", filterable: true },
        { key: "assigned_to", label: "Asignado a", filterable: true },
        { key: "type", label: "Tipo", filterable: true },
        { key: "measure", label: "Medida", filterable: true },
        { key: "order_number", label: "Nro de Pedido", filterable: true },
        {
            key: "status",
            label: "Estado",
            filterable: true,
            options: [
                { value: "", label: "Todos" },
                { value: "Pendiente", label: "Pendiente" },
                { value: "En proceso", label: "En proceso" },
                { value: "Finalizado", label: "Finalizado" },
                { value: "Cancelado", label: "Cancelado" },
            ],
        },
    ];

    return (
        <div className="flex flex-start items-center w-full">
            {/* 📅 Selector de Fecha */}
            <div className="relative w-[200px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                    </svg>
                </div>
                <input
                    type="date"
                    id="order-date"
                    onChange={(e) => onDateChange(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                    placeholder="Seleccionar fecha"
                />
            </div>

            {/* 🔍 Filtros múltiples */}
            <div className="flex-1 min-w-[300px]">
                <Filter columns={filterColumns} onFilterChange={onFilterChange} />
            </div>

            {/* (Opcional) Botón limpiar filtros */}
            {/*
      <div>
        <button
          onClick={onClearFilters}
          className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          Limpiar filtros
        </button>
      </div>
      */}
        </div>
    );
};

export default OrderFilter;
