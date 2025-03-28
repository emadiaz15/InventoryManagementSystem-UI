import React from "react";
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

const getDefaultImage = () => {
    const defaultImages = ["/rollo.png", "/bobina.png"];
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
};

const KanbanCard = ({
    order,
    onAddToOrder,
    onEdit,
    onDelete,
    onViewDetails, // 👈 nuevo prop para EyeIcon
}) => {
    const imageUrl = order.technical_sheet_photo || getDefaultImage();

    return (
        <div className="w-full max-w-sm bg-white border border-neutral-500 rounded-lg shadow-md">
            <img className="p-4 rounded-t-lg" src={imageUrl} alt={order.name} />
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-text-primary">
                    {order.name}
                </h5>
                <p className="text-sm text-text-primary">{order.description}</p>
                <ul className="mt-2 text-sm text-text-secondary">
                    <li><strong>ID subproduct:</strong> {order.subproduct}</li>
                    <li><strong>Type:</strong> {order.type || "Sin type"}</li>
                    <li><strong>Cliente:</strong> {order.customer}</li>
                    <li><strong>Cantidad a Cortar:</strong> {order.cutting_quantity}</li>
                    <li><strong>Nro de Pedido:</strong> {order.id}</li>
                    <li><strong>Asignado a:</strong> {order.assigned_to}</li>
                    <li><strong>Creado por:</strong> {order.created_by}</li>
                    <li><strong>Estado:</strong> {order.status}</li>
                </ul>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={onViewDetails}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded"
                        title="Ver detalles"
                    >
                        <EyeIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={onEdit}
                        className="p-2 bg-primary-500 hover:bg-primary-600 rounded"
                        title="Editar orden"
                    >
                        <PencilIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 bg-error-500 hover:bg-error-600 rounded"
                        title="Eliminar orden"
                    >
                        <TrashIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                <div className="mt-4 text-xs text-text-secondary">
                    <p><strong>Fecha de creación:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    <p><strong>Última modificación:</strong> {order.modified_at ? new Date(order.modified_at).toLocaleString() : "N/A"}</p>
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;
