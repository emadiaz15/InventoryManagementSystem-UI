import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";

// Mapeo de colores y etiquetas para cada estado
const STATUS_CONFIG = {
    pending: { color: "bg-gray-500", label: "Pendiente" },
    in_process: { color: "bg-blue-500", label: "En Proceso" },
    completed: { color: "bg-green-500", label: "Completada" },
    cancelled: { color: "bg-red-500", label: "Cancelada" },
};

const ViewCuttingOrderModal = ({ order, isOpen, onClose }) => {
    if (!order) return null;

    const cfg = STATUS_CONFIG[order.workflow_status] || STATUS_CONFIG.pending;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Orden #${order.id}`}
            position="center"
            maxWidth="max-w-3xl"
        >
            <div className="space-y-4 text-text-primary">
                {/* Cabecera con Cliente y Estado */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold truncate">
                        Cliente: {order.customer}
                    </h2>
                    <div className="flex items-center">
                        <span
                            className={`inline-block w-3 h-3 rounded-full mr-2 ${cfg.color}`}
                        />
                        <span className="font-semibold">{cfg.label}</span>
                    </div>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p>
                        <span className="font-semibold">Asignado a:</span>{" "}
                        {order.assigned_to || "—"}
                    </p>
                    <p>
                        <span className="font-semibold">Creada en:</span>{" "}
                        {order.created_at || "—"}
                    </p>
                    {order.completed_at && (
                        <p>
                            <span className="font-semibold">Completada en:</span>{" "}
                            {order.completed_at}
                        </p>
                    )}
                </div>

                {/* Lista de items */}
                <div>
                    <h3 className="font-semibold mb-2">Items de Corte:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        {order.items.map((it) => (
                            <li key={it.id}>
                                Subproducto <strong>{it.subproduct}</strong>:{" "}
                                <span className="font-medium">{it.cutting_quantity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Botón de cerrar */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </Modal>
    );
};

ViewCuttingOrderModal.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        customer: PropTypes.string,
        workflow_status: PropTypes.oneOf(["pending", "in_process", "completed", "cancelled"]).isRequired,
        assigned_to: PropTypes.string,
        created_at: PropTypes.string,
        completed_at: PropTypes.string,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                subproduct: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                cutting_quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            })
        ).isRequired,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ViewCuttingOrderModal;
