import React from "react";
import PropTypes from "prop-types";
import Modal from "@/components/ui/Modal";

const ViewSubproductModal = ({ subproduct, isOpen, onClose, mediaPanel }) => {
    if (!subproduct) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Subproducto"
            position="center"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col lg:flex-row gap-4 h-full text-text-primary">
                <div className="flex-1 space-y-2 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
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
                    <p>
                        <span className="font-semibold">Código:</span>{" "}
                        {subproduct.parent_code || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Marca:</span>{" "}
                        {subproduct.brand || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Bobina N°:</span>{" "}
                        {subproduct.number_coil || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Enumeración Inicial:</span>{" "}
                        {subproduct.initial_enumeration ?? "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Enumeración Final:</span>{" "}
                        {subproduct.final_enumeration ?? "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Peso Bruto (kg):</span>{" "}
                        {subproduct.gross_weight ?? "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Peso Neto (kg):</span>{" "}
                        {subproduct.net_weight ?? "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Stock Inicial:</span>{" "}
                        {subproduct.initial_stock_quantity ?? "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Ubicación:</span>{" "}
                        {subproduct.location || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Tipo de Forma:</span>{" "}
                        {subproduct.form_type || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Observaciones:</span>{" "}
                        {subproduct.observations || "N/A"}
                    </p>
                    <p className="flex items-center">
                        <span className="font-semibold mr-2">Estado:</span>
                        <span
                            className={`inline-block w-3 h-3 mr-2 rounded-full ${subproduct.status ? "bg-green-500" : "bg-red-500"
                                }`}
                        />
                        {subproduct.status ? "Disponible" : "Terminada"}
                    </p>
                    <p>
                        <span className="font-semibold">Fecha de Ingreso:</span>{" "}
                        {subproduct.created_at || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Modificado en:</span>{" "}
                        {subproduct.modified_at || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Ingresado por:</span>{" "}
                        {subproduct.created_by || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Modificado por:</span>{" "}
                        {subproduct.modified_by || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">ID:</span> {subproduct.id}
                    </p>
                </div>

                <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                    {mediaPanel}
                </div>
            </div>

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

ViewSubproductModal.propTypes = {
    subproduct: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mediaPanel: PropTypes.node.isRequired,
};

export default ViewSubproductModal;
