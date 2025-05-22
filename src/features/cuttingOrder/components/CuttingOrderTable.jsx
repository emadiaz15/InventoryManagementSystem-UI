import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/common/Table";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthProvider";

const CuttingOrderTable = ({ orders, onView, onEdit, onDelete }) => {
    const { user } = useAuth();
    const isStaff = user?.is_staff;
    const navigate = useNavigate();

    const headers = [
        "ID subproduct",
        "Tipo",
        "Medida",
        "Cliente",
        "Cantidad a cortar",
        "Nro de Pedido",
        "Asignado a",
        "Creado por",
        "Estado",
        "Acciones",
    ];

    const rows = orders.map((order) => ({
        "ID subproduct": order.subproduct,
        Tipo: order.type || "Sin tipo",
        Medida: order.measure || "Sin medida",
        Cliente: order.customer || "Sin cliente",
        "Cantidad a cortar": order.cutting_quantity,
        "Nro de Pedido": order.id,
        "Asignado a": order.assigned_to || "Sin asignación",
        "Creado por": order.created_by || "N/A",
        Estado: order.status || "N/A",
        Acciones: (
            <div className="flex space-x-2">
                <button
                    onClick={() => onView(order)}
                    className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                    aria-label="Ver detalles de la orden"
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>
                {isStaff && (
                    <button
                        onClick={() => onEdit(order)}
                        className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                        aria-label="Editar orden"
                    >
                        <PencilIcon className="w-5 h-5 text-white" />
                    </button>
                )}
                {isStaff && (
                    <button
                        onClick={() => onDelete(order.id)}
                        className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                        aria-label="Eliminar orden"
                    >
                        <TrashIcon className="w-5 h-5 text-white" />
                    </button>
                )}
            </div>
        ),
    }));

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table headers={headers} rows={rows} />
        </div>
    );
};

export default CuttingOrderTable;
