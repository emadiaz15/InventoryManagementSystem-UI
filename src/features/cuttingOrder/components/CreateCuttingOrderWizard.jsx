import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthProvider";
import { listUsers } from "../../user/services/listUsers";
import { listSubproducts } from "../../product/services/subproducts/subproducts";
import { useListProducts } from "@/features/product/hooks/useProductHooks";
import createCuttingOrder from "../services/createCuttingOrder";
import { buildCuttingOrderPayload } from "../utils/buildCuttingOrderPayload";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";
import Spinner from "../../../components/ui/Spinner";

export default function CreateCuttingOrderWizard({
    isOpen,
    onClose,
    onSave,
    productId,
}) {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [assignedTo, setAssignedTo] = useState("");

    // usuarios
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");

    // productos para elegir
    const {
        products,
        loadingProducts,
        error: productsError
    } = useListProducts({ status: true, page_size: 100 });
    const [selectedProductId, setSelectedProductId] = useState(productId || "");

    // subproductos
    const activeProductId = productId || selectedProductId;
    const [subproducts, setSubproducts] = useState([]);
    const [loadingSubs, setLoadingSubs] = useState(false);
    const [subsError, setSubsError] = useState("");

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
            setSubproducts([]);
            setSubsError("");
            setError("");
            setSuccess(false);
        }
    }, [isOpen, productId]);

    useEffect(() => {
        if (!isOpen) return;
        setLoadingUsers(true);
        listUsers("/users/list/?status=true")
            .then((data) => setUsers(data.results || []))
            .catch(() => setUsersError("No se pudieron cargar los usuarios"))
            .finally(() => setLoadingUsers(false));
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || !activeProductId) return;
        setLoadingSubs(true);
        listSubproducts(activeProductId)
            .then((data) => setSubproducts(data.results || []))
            .catch(() => setSubsError("No se pudieron cargar subproductos"))
            .finally(() => setLoadingSubs(false));
    }, [isOpen, activeProductId]);

    const validateStep1 = () =>
        orderNumber.trim() && customer.trim() && (productId || selectedProductId);

    const validateStep2 = () =>
        Object.values(selectedItems).some((q) => !isNaN(q) && q > 0);

    const handleNext = () => {
        setError("");
        if (!validateStep1()) setError("Rellena todos los campos del paso 1");
        else setStep(2);
    };

    const handleBack = () => {
        setError("");
        setStep(1);
    };

    const toggleSubproduct = (id) => {
        setSelectedItems((prev) => {
            const nxt = { ...prev };
            nxt[id] ? delete nxt[id] : (nxt[id] = 1);
            return nxt;
        });
    };

    const handleQuantityChange = (id, val) => {
        const n = parseFloat(val);
        setSelectedItems((prev) => ({ ...prev, [id]: isNaN(n) ? "" : n }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validateStep2()) {
            setError("Debes elegir al menos un subproducto y cantidad.");
            return;
        }
        const items = Object.entries(selectedItems).map(([sub, qty]) => ({
            subproduct: sub,
            cutting_quantity: qty,
        }));
        const payload = buildCuttingOrderPayload({
            order_number: orderNumber,
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
            setError(err.response?.data?.detail || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Orden de Corte">
            <form
                onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()}
                className="space-y-4"
            >
                {(error || usersError || subsError || productsError) && (
                    <ErrorMessage
                        message={error || usersError || subsError || productsError}
                        onClose={() => setError("")}
                    />
                )}

                {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                            label="Número de Pedido"
                            name="order_number"
                            type="number"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            required
                        />
                        <FormInput
                            label="Cliente"
                            name="customer"
                            value={customer}
                            onChange={(e) => setCustomer(e.target.value)}
                            required
                        />
                        {!productId && (
                            <FormSelect
                                label="Producto"
                                name="product"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                loading={loadingProducts}
                                options={[
                                    { value: "", label: "Seleccione un producto" },
                                    ...products.map((p) => ({
                                        value: String(p.id),
                                        label: p.name,
                                    })),
                                ]}
                                required
                            />
                        )}
                        <div>
                            <label className="block text-sm font-medium text-text-secondary">
                                Creado por
                            </label>
                            <p className="mt-1 p-2 bg-gray-50 rounded">
                                {user?.first_name || user.username} {user?.last_name}
                            </p>
                        </div>
                        <FormSelect
                            label="Asignar a"
                            name="assigned_to"
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            loading={loadingUsers}
                            options={[
                                { value: "", label: "— Sin asignar —" },
                                ...users.map((u) => ({
                                    value: String(u.id),
                                    label:
                                        u.first_name && u.last_name
                                            ? `${u.first_name} ${u.last_name}`
                                            : u.username,
                                })),
                            ]}
                        />
                    </div>
                )}

                {step === 2 && (
                    <>
                        <p className="font-semibold">
                            Selecciona subproductos y cantidades:
                        </p>
                        {loadingSubs ? (
                            <div className="flex justify-center py-6">
                                <Spinner size="6" color="text-primary-500" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
                                {subproducts.map((sp) => {
                                    const sel = !!selectedItems[sp.id];
                                    return (
                                        <div
                                            key={sp.id}
                                            className={`relative border rounded p-3 shadow-sm transition-all duration-200 cursor-pointer ${sel
                                                ? "border-primary-500 bg-primary-50"
                                                : "hover:border-primary-300"
                                                }`}
                                            onClick={() => toggleSubproduct(sp.id)}
                                        >
                                            <div className="absolute top-2 right-2">
                                                <input
                                                    type="checkbox"
                                                    checked={sel}
                                                    onChange={() => toggleSubproduct(sp.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="font-semibold">{sp.parent_name}</div>
                                            <div className="text-sm text-gray-600">
                                                Bobina {sp.number_coil}
                                            </div>
                                            {sel && (
                                                <div className="mt-2">
                                                    <label className="block text-xs text-gray-500 mb-1">
                                                        Cantidad
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full border rounded p-1"
                                                        value={selectedItems[sp.id]}
                                                        onChange={(e) =>
                                                            handleQuantityChange(sp.id, e.target.value)
                                                        }
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
    productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
