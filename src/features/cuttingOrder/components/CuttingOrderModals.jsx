import React from "react";
import { useAuth } from "../../../context/AuthProvider";
import EditCuttingOrderModal from "./EditCuttingOrderModal";
import ViewCuttingOrderModal from "./ViewCuttingOrderModal";
import DeleteMessage from "../../../components/common/DeleteMessage";
import CreateCuttingOrderWizard from "./CreateCuttingOrderWizard";

/**
 * Componente central de todos los modales asociados a órdenes de corte.
 */
const CuttingOrderModals = ({
    modalState,
    closeModal,
    onCreateOrder,
    onUpdateOrder,
    onDeleteOrder,
    isDeleting,
    deleteError,
    clearDeleteError,
}) => {
    const { user } = useAuth();
    const isStaff = user?.is_staff;

    // Desestructuramos el estado del modal
    const { type = "", orderData = {} } = modalState || {};
    const orderId = orderData?.id;

    // Si no hay tipo, no renderizamos nada
    if (!type) return null;

    return (
        <>
            {/* Crear nueva orden */}
            {type === "create" && isStaff && (
                <CreateCuttingOrderWizard
                    isOpen={true}
                    onClose={closeModal}
                    onSave={onCreateOrder}
                    productId={null}
                />
            )}

            {/* Editar orden existente */}
            {type === "edit" && isStaff && orderData && (
                <EditCuttingOrderModal
                    isOpen={true}
                    onClose={closeModal}
                    order={orderData}
                    onSave={onUpdateOrder}
                />
            )}

            {/* Ver detalles de la orden */}
            {type === "view" && orderData && (
                <ViewCuttingOrderModal
                    isOpen={true}
                    onClose={closeModal}
                    order={orderData}
                />
            )}

            {/* Confirmación de eliminación */}
            {type === "deleteConfirm" && isStaff && orderData && (
                <DeleteMessage
                    isOpen={true}
                    onClose={closeModal}
                    onDelete={() => onDeleteOrder(orderData.id)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="la orden de corte"
                    itemIdentifier={`#${orderId}`}
                />
            )}
        </>
    );
};

export default CuttingOrderModals;
