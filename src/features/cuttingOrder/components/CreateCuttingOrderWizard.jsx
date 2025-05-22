import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthProvider";
import { listUsers } from "../../user/services/listUsers";
import { useSubproducts } from "../../product/hooks/useSubproducts";
import createCuttingOrder from "../services/createCuttingOrder";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

export default function CreateCuttingOrderWizard({ isOpen, onClose, onSave, productId }) {
    const { user } = useAuth();

    // Paso actual: 1 = datos básicos, 2 = selección de subproductos
    const [step, setStep] = useState(1);

    // --- Paso 1: datos básicos ---
    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");

    // --- Paso 2: subproductos ---
    const { subproducts, loading: loadingSubs, error: subsError } =
        useSubproducts(productId, { status: true, page_size: 100 });
    const [selectedItems, setSelectedItems] = useState({}); // { subproductId: quantity, ... }

    // Errores y feedback
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Al abrir/cerrar: resetear todo
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOrderNumber("");
            setCustomer("");
            setAssignedTo("");
            setUsers([]);
            setUsersError("");
            setSelectedItems({});
            setError("");
            setSuccess(false);
        }
    }, [isOpen]);

    // Cargar usuarios activos para “Asignar a”
    useEffect(() => {
        if (!isOpen) return;
        setLoadingUsers(true);
        listUsers("/users/list/?status=true")
            .then(data => setUsers(data.results || []))
            .catch(() => setUsersError("No se pudieron cargar los usuarios"))
            .finally(() => setLoadingUsers(false));
    }, [isOpen]);

    // Validación paso 1
    const validateStep1 = () => {
        if (!orderNumber.trim()) {
            setError("El número de pedido es obligatorio.");
            return false;
        }
        if (!customer.trim()) {
            setError("El campo Cliente es obligatorio.");
            return false;
        }
        return true;
    };

    // Validación paso 2
    const validateStep2 = () => {
        const entries = Object.entries(selectedItems).filter(([_, qty]) => qty > 0);
        if (entries.length === 0) {
            setError("Debes seleccionar al menos un subproducto con cantidad.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError("");
        if (step === 1 && validateStep1()) setStep(2);
    };

    const handleBack = () => {
        setError("");
        setStep(1);
    };

    const handleQuantityChange = (id, value) => {
        setSelectedItems(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validateStep2()) return;

        const itemsPayload = Object.entries(selectedItems)
            .filter(([_, qty]) => qty > 0)
            .map(([subproduct, qty]) => ({
                subproduct: parseInt(subproduct, 10),
                cutting_quantity: parseFloat(qty)
            }));

        const payload = {
            order_number: parseInt(orderNumber, 10),
            customer: customer.trim(),
            assigned_to: assignedTo || null,
            items: itemsPayload
        };

        setLoading(true);
        try {
            await createCuttingOrder(payload);
            setSuccess(true);
            onSave?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Error al crear la orden.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Orden de Corte">
            <form onSubmit={step === 2 ? handleSubmit : e => e.preventDefault()} className="space-y-4">
                {(error || usersError || subsError) && (
                    <ErrorMessage
                        message={error || usersError || subsError}
                        onClose={() => setError("")}
                    />
                )}

                {step === 1 && (
                    <>
                        {/* Paso 1 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                label="Número de Pedido"
                                name="order_number"
                                type="number"
                                value={orderNumber}
                                onChange={e => setOrderNumber(e.target.value)}
                                required
                            />
                            <FormInput
                                label="Cliente"
                                name="customer"
                                value={customer}
                                onChange={e => setCustomer(e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">
                                    Creado por
                                </label>
                                <p className="mt-1 p-2 bg-gray-50 rounded">{user?.first_name || user.username} {user?.last_name}</p>
                            </div>
                            <FormSelect
                                label="Asignar a"
                                name="assigned_to"
                                value={assignedTo}
                                onChange={e => setAssignedTo(e.target.value)}
                                loading={loadingUsers}
                                options={[
                                    { value: "", label: "— Sin asignar —" },
                                    ...users.map(u => ({
                                        value: String(u.id),
                                        label: u.first_name && u.last_name
                                            ? `${u.first_name} ${u.last_name}`
                                            : u.username
                                    }))
                                ]}
                            />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        {/* Paso 2: seleccionar subproductos */}
                        <p className="font-semibold">Selecciona subproductos y cantidades:</p>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {subproducts.map(sp => (
                                <div key={sp.id} className="flex items-center space-x-4">
                                    <div className="flex-1">
                                        <p className="truncate">
                                            {sp.parent_name} – Bobina {sp.number_coil}
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Cantidad"
                                        value={selectedItems[sp.id] || ""}
                                        onChange={e => handleQuantityChange(sp.id, e.target.value)}
                                        className="w-24 border rounded p-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="flex justify-between mt-4">
                    {step === 2 ? (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
                            disabled={loading}
                        >
                            ← Atrás
                        </button>
                    ) : (
                        <span />
                    )}

                    {step === 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                        >
                            Siguiente →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                        >
                            {loading ? "Guardando..." : "Crear Corte"}
                        </button>
                    )}
                </div>

                {success && (
                    <SuccessMessage
                        message="Orden de corte creada exitosamente"
                        onClose={() => setSuccess(false)}
                    />
                )}
            </form>
        </Modal>
    );
}

CreateCuttingOrderWizard.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
