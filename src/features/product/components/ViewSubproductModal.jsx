import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";

/**
 * Modal para ver detalles de un subproducto e inyectar contenido adicional (e.g. multimedia) al lado.
 */
const ViewSubproductModal = ({ subproduct, isOpen, onClose, children }) => {
    if (!subproduct) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Subproducto"
            position="center"
            maxWidth="max-w-6xl"
        >
            {/* Layout: detalles y multimedia lado a lado */}
            <div className="flex flex-col lg:flex-row gap-4 h-full text-text-primary">
                {/* Detalles */}
                <div className="flex-1 space-y-2 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    {/* Mantener todos los <p> originales sin tocar */}
                    <p>
                        <span className="font-extrabold text-2xl">
                            {subproduct.parent_type_name} - {subproduct.parent_name}
                        </span>
                    </p>
                    <p>
                        <span className="font-extrabold text-2xl">
                            Stock: {subproduct.current_stock ?? 0} Mts
                        </span>
                    </p>
                    <p><span className="font-semibold">Código:</span> {subproduct.code || "N/A"}</p>
                    <p><span className="font-semibold">Marca:</span> {subproduct.brand || "N/A"}</p>
                    <p><span className="font-semibold">Bobina N°:</span> {subproduct.number_coil || "N/A"}</p>
                    <p><span className="font-semibold">Enumeración Inicial:</span> {subproduct.initial_enumeration ?? "N/A"}</p>
                    <p><span className="font-semibold">Enumeración Final:</span> {subproduct.final_enumeration ?? "N/A"}</p>
                    <p><span className="font-semibold">Peso Bruto (kg):</span> {subproduct.gross_weight ?? "N/A"}</p>
                    <p><span className="font-semibold">Peso Neto (kg):</span> {subproduct.net_weight ?? "N/A"}</p>
                    <p><span className="font-semibold">Stock Inicial:</span> {subproduct.initial_stock_quantity ?? "N/A"}</p>
                    <p><span className="font-semibold">Ubicación:</span> {subproduct.location || "N/A"}</p>
                    <p><span className="font-semibold">Tipo de Forma:</span> {subproduct.form_type || "N/A"}</p>
                    <p><span className="font-semibold">Observaciones:</span> {subproduct.observations || "N/A"}</p>
                    <p><span className="font-semibold">Estado:</span> {subproduct.status ? "Activo" : "Inactivo"}</p>
                    <p><span className="font-semibold">Fecha de Ingreso:</span> {subproduct.created_at || "N/A"}</p>
                    <p><span className="font-semibold">Modificado en:</span> {subproduct.modified_at || "N/A"}</p>
                    <p><span className="font-semibold">Ingresado por:</span> {subproduct.created_by || "N/A"}</p>
                    <p><span className="font-semibold">Modificado por:</span> {subproduct.modified_by || "N/A"}</p>
                    <p><span className="font-semibold">ID:</span> {subproduct.id}</p>
                </div>

                {/* Multimedia al lado */}
                {children && (
                    <div className="w-full lg:w-1/2 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                        {children}
                    </div>
                )}
            </div>

            {/* Botón Cerrar */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary-500 text-text-white rounded hover:bg-primary-600 transition-colors"
                >Cerrar</button>
            </div>
        </Modal>
    );
};

ViewSubproductModal.propTypes = {
    subproduct: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

export default ViewSubproductModal;