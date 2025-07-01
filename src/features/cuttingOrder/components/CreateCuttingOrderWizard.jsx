import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthProvider";
import { listUsers } from "../../user/services/listUsers";
import { useSubproducts } from "../../product/hooks/useSubproducts";
import { useProducts } from "../../product/hooks/useProducts";
import createCuttingOrder from "../services/createCuttingOrder";
import { buildCuttingOrderPayload } from "../utils/buildCuttingOrderPayload";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

export default function CreateCuttingOrderWizard({ isOpen, onClose, onSave, productId }) {
    const { user } = useAuth();

    const [step, setStep] = useState(1);
    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");

    const [selectedProductId, setSelectedProductId] = useState(productId || "");
    const { data: productsData, isLoading: loadingProducts, error: productsError } = useProducts({ status: true, page_size: 100 });
    const products = productsData?.results || [];

    const activeProductId = productId || selectedProductId;
    const { data: subData, isLoading: loadingSubs, error: subsError } = useSubproducts(activeProductId, {
        status: true,
        page_size: 100
    });
    const subproducts = subData?.results || [];

    const [selectedItems, setSelectedItems] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOrderNumber("");
            setCustomer("");
            setAssignedTo("");
            setUsers([]);
            setUsersError("");
            setSelectedItems({});
            setSelectedProductId(productId || "");
            setError("");
            setSuccess(false);
        }
    }, [isOpen, productId]);

    useEffect(() => {
        if (!isOpen) return;
        setLoadingUsers(true);
        listUsers("/users/list/?status=true")
            .then(data => setUsers(data.results || []))
            .catch(() => setUsersError("No se pudieron cargar los usuarios"))
            .finally(() => setLoadingUsers(false));
    }, [isOpen]);

    const validateStep1 = () => {
        if (!orderNumber.trim()) {
            setError("El número de pedido es obligatorio.");
            return false;
        }
        if (!customer.trim()) {
            setError("El campo Cliente es obligatorio.");
            return false;
        }
        if (!productId && !selectedProductId) {
            setError("Debes seleccionar un producto.");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const entries = Object.entries(selectedItems).filter(([_, qty]) =>
            !isNaN(parseFloat(qty)) && parseFloat(qty) > 0
        );
        if (entries.length === 0) {
            setError("Debes seleccionar al menos un subproducto con cantidad.");
            return false;
        }
        return true;
    };

    const handleNext = () => {
        setError("");
        if (validateStep1()) setStep(2);
    };

    const handleBack = () => {
        setError("");
        setStep(1);
    };

    const toggleSubproduct = (id) => {
        setSelectedItems((prev) => {
            const next = { ...prev };
            if (next[id]) {
                delete next[id];
            } else {
                next[id] = 1;
            }
            return next;
        });
    };

    const handleQuantityChange = (id, value) => {
        const parsed = parseFloat(value);
        setSelectedItems(prev => ({
            ...prev,
            [id]: isNaN(parsed) ? "" : parsed
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validateStep2()) return;

        const items = Object.entries(selectedItems).map(([subproduct, qty]) => ({
            subproduct,
            cutting_quantity: qty,
        }));

        const payload = buildCuttingOrderPayload({
            order_number,
            customer,
            items,
            assigned_to: assignedTo || null,
        });

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
                {(error || usersError || subsError || productsError) && (
                    <ErrorMessage
                        message={error || usersError || subsError || productsError}
                        onClose={() => setError("")}
                    />
                )}

                <div key={`step-${step}`} className="space-y-4">
                    {step === 1 && (
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
                            {!productId && (
                                <FormSelect
                                    label="Producto"
                                    name="product"
                                    value={selectedProductId}
                                    onChange={e => setSelectedProductId(e.target.value)}
                                    loading={loadingProducts}
                                    options={[
                                        { value: "", label: "Seleccione un producto" },
                                        ...products.map(p => ({ value: String(p.id), label: p.name }))
                                    ]}
                                    required
                                />
                            )}
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Creado por</label>
                                <p className="mt-1 p-2 bg-gray-50 rounded">
                                    {user?.first_name || user.username} {user?.last_name}
                                </p>
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
                    )}

                    {step === 2 && (
                        <>
                            <p className="font-semibold">Selecciona subproductos y cantidades:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                                {subproducts.map((sp) => {
                                    const isSelected = selectedItems.hasOwnProperty(sp.id);
                                    return (
                                        <div
                                            key={sp.id}
                                            className={`relative border rounded p-3 shadow-sm transition-all duration-200 cursor-pointer ${isSelected ? "border-primary-500 bg-primary-50" : "hover:border-primary-300"
                                                }`}
                                            onClick={() => toggleSubproduct(sp.id)}
                                        >
                                            <div className="absolute top-2 right-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSubproduct(sp.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>

                                            <div className="font-semibold">{sp.parent_name}</div>
                                            <div className="text-sm text-gray-600">Bobina {sp.number_coil}</div>

                                            {isSelected && (
                                                <div className="mt-2">
                                                    <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full border rounded p-1"
                                                        value={selectedItems[sp.id]}
                                                        onChange={(e) => handleQuantityChange(sp.id, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

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
    productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
