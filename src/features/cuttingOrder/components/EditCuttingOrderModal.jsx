import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

import { updateCuttingOrder } from "../services/updateCuttingOrder";
import { useSubproducts } from "../../product/hooks/useSubproducts";

const EditCuttingOrderModal = ({ isOpen, onClose, onSave, order }) => {
    const { subproducts, loading: loadingSubs, error: subsError } = useSubproducts();
    const [formData, setFormData] = useState({ customer: "", items: [] });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Cuando abrimos el modal o cambia la orden, precargamos el formulario
    useEffect(() => {
        if (isOpen && order) {
            setFormData({
                customer: order.customer || "",
                items: order.items.map((it) => ({
                    subproduct: String(it.subproduct),
                    cutting_quantity: String(it.cutting_quantity),
                })),
            });
            setError("");
            setSuccess(false);
        }
    }, [isOpen, order]);

    const handleCustomerChange = (e) =>
        setFormData((prev) => ({ ...prev, customer: e.target.value }));

    const handleItemChange = (idx, e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            items: prev.items.map((it, i) =>
                i === idx ? { ...it, [name]: value } : it
            ),
        }));
    };

    const addItem = () =>
        setFormData((prev) => ({
            ...prev,
            items: [...prev.items, { subproduct: "", cutting_quantity: "" }],
        }));

    const removeItem = (idx) =>
        setFormData((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx),
        }));

    const validate = () => {
        if (!formData.customer.trim()) {
            setError("El campo Cliente es obligatorio.");
            return false;
        }
        for (const it of formData.items) {
            if (!it.subproduct || !it.cutting_quantity) {
                setError("Cada item debe tener subproducto y cantidad.");
                return false;
            }
            if (parseFloat(it.cutting_quantity) <= 0) {
                setError("La cantidad a cortar debe ser mayor a cero.");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validate()) return;

        const payload = {
            customer: formData.customer.trim(),
            items: formData.items.map((it) => ({
                subproduct: parseInt(it.subproduct, 10),
                cutting_quantity: parseFloat(it.cutting_quantity),
            })),
        };

        setLoading(true);
        try {
            await updateCuttingOrder(order.id, payload);
            setSuccess(true);
            onSave?.();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.message ||
                "Error al actualizar la orden."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Orden de Corte">
            <form onSubmit={handleSubmit} className="space-y-4">
                {(error || subsError) && (
                    <ErrorMessage
                        message={error || "Error al cargar subproductos."}
                        onClose={() => setError("")}
                    />
                )}

                <FormInput
                    label="Cliente"
                    name="customer"
                    value={formData.customer}
                    onChange={handleCustomerChange}
                    required
                />

                {formData.items.map((item, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
                    >
                        <FormSelect
                            label="Subproducto"
                            name="subproduct"
                            value={item.subproduct}
                            onChange={(e) => handleItemChange(idx, e)}
                            options={subproducts.map((s) => ({
                                value: String(s.id),
                                label: s.name,
                            }))}
                            disabled={loadingSubs}
                            required
                        />
                        <FormInput
                            label="Cantidad a cortar"
                            name="cutting_quantity"
                            type="number"
                            step="0.01"
                            value={item.cutting_quantity}
                            onChange={(e) => handleItemChange(idx, e)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => removeItem(idx)}
                            className="text-red-600 hover:underline"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addItem}
                    className="text-primary-500 hover:underline"
                >
                    + Agregar Item
                </button>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                    >
                        {loading ? "Guardando..." : "Actualizar Corte"}
                    </button>
                </div>

                {success && (
                    <SuccessMessage
                        message="Orden de corte actualizada exitosamente"
                        onClose={() => setSuccess(false)}
                    />
                )}
            </form>
        </Modal>
    );
};

EditCuttingOrderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    order: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        customer: PropTypes.string,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                subproduct: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
                cutting_quantity: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
            })
        ),
    }).isRequired,
};

export default EditCuttingOrderModal;
