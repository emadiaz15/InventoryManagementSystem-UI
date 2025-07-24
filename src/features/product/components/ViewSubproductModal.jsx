// src/features/product/components/ViewSubproductModal.jsx
import React from "react"
import PropTypes from "prop-types"
import Modal from "@/components/ui/Modal"

const ViewSubproductModal = ({ subproduct, isOpen, onClose, mediaPanel }) => {
    // Si no hay subproducto o el modal está cerrado, no renderizamos nada
    if (!subproduct || !isOpen) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Subproducto"
            position="center"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col lg:flex-row gap-4 h-full text-text-primary">
                {/* — Datos */}
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
                    <p><strong>Código:</strong> {subproduct.parent_code || "N/A"}</p>
                    <p><strong>Marca:</strong> {subproduct.brand || "N/A"}</p>
                    <p><strong>Bobina N°:</strong> {subproduct.number_coil || "N/A"}</p>
                    <p><strong>Enumeración Inicial:</strong> {subproduct.initial_enumeration ?? "N/A"}</p>
                    <p><strong>Enumeración Final:</strong> {subproduct.final_enumeration ?? "N/A"}</p>
                    <p><strong>Peso Bruto (kg):</strong> {subproduct.gross_weight ?? "N/A"}</p>
                    <p><strong>Peso Neto (kg):</strong> {subproduct.net_weight ?? "N/A"}</p>
                    <p><strong>Stock Inicial:</strong> {subproduct.initial_stock_quantity ?? "N/A"}</p>
                    <p><strong>Ubicación:</strong> {subproduct.location || "N/A"}</p>
                    <p><strong>Tipo de Forma:</strong> {subproduct.form_type || "N/A"}</p>
                    <p><strong>Observaciones:</strong> {subproduct.observations || "N/A"}</p>
                    <p className="flex items-center">
                        <strong className="mr-2">Estado:</strong>
                        <span
                            className={`inline-block w-3 h-3 mr-2 rounded-full ${subproduct.status ? "bg-green-500" : "bg-red-500"
                                }`}
                        />
                        {subproduct.status ? "Disponible" : "Terminada"}
                    </p>
                    <p><strong>Fecha de Ingreso:</strong> {subproduct.created_at || "N/A"}</p>
                    <p><strong>Modificado en:</strong> {subproduct.modified_at || "N/A"}</p>
                    <p><strong>Ingresado por:</strong> {subproduct.created_by || "N/A"}</p>
                    <p><strong>Modificado por:</strong> {subproduct.modified_by || "N/A"}</p>
                    <p><strong>ID:</strong> {subproduct.id}</p>
                </div>

                {/* — Panel multimedia (spinner o carousel) */}
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
    )
}

ViewSubproductModal.propTypes = {
    subproduct: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mediaPanel: PropTypes.node.isRequired,
}

export default ViewSubproductModal
