// src/features/cuttingOrder/components/CreateCuttingOrderModal.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthProvider";
import { listUsers } from "../../user/services/listUsers";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

import createCuttingOrder from "../services/createCuttingOrder";

const CreateCuttingOrderModal = ({ isOpen, onClose, onSave, subproduct }) => {
    const { user } = useAuth();

    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [quantity, setQuantity] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Cuando se abre/cierra el modal, resetear
    useEffect(() => {
        if (isOpen) {
            setOrderNumber("");
            setCustomer("");
            setQuantity("");
            setAssignedTo("");
            setError("");
            setSuccess(false);
        }
    }, [isOpen]);

    // Cargar lista de usuarios activos para "Asignar a"
    useEffect(() => {
        setLoadingUsers(true);
        listUsers("/users/list/?status=true")
            .then((data) => setUsers(data.results || []))
            .catch(() => setUsersError("No se pudieron cargar los usuarios."))
            .finally(() => setLoadingUsers(false));
    }, []);

    const validate = () => {
        if (!orderNumber.trim()) {
            setError("El Número de Pedido es obligatorio.");
            return false;
        }
        if (!customer.trim()) {
            setError("El campo Cliente es obligatorio.");
            return false;
        }
        if (!quantity || Number(quantity) <= 0) {
            setError("La cantidad a cortar debe ser mayor a cero.");
            return false;
        }
        if (!subproduct?.id) {
            setError("Subproducto inválido.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!validate()) return;

        const payload = {
            order_number: parseInt(orderNumber, 10),
            customer: customer.trim(),
            assigned_to: assignedTo || null,
            items: [
                {
                    subproduct: subproduct.id,
                    cutting_quantity: parseFloat(quantity),
                },
            ],
        };

        setLoading(true);
        try {
            await createCuttingOrder(payload);
            setSuccess(true);
            onSave?.();
            onClose();
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.message ||
                "Error al crear la orden de corte."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Orden de Corte">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mensajes de error */}
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {usersError && (
                    <ErrorMessage message={usersError} onClose={() => setUsersError("")} />
                )}

                {/* Datos del subproducto */}
                <div className="space-y-1 bg-gray-50 p-3 rounded">
                    <p className="font-semibold text-gray-700">
                        {subproduct.parent_type_name} – {subproduct.parent_name}
                    </p>
                    <p>
                        <strong>Bobina N°:</strong> {subproduct.number_coil}
                    </p>
                    <p>
                        <strong>Marca:</strong> {subproduct.brand}
                    </p>
                </div>

                {/* Creado por (usuario actual) */}
                <div className="p-2">
                    <p>
                        <strong>Creado por:</strong>{" "}
                        {user?.first_name && user?.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Número de Pedido */}
                    <FormInput
                        label="Número de Pedido"
                        name="order_number"
                        type="number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        required
                    />
                    {/* Cantidad a cortar */}
                    <FormInput
                        label="Cantidad a cortar"
                        name="cutting_quantity"
                        type="number"
                        step="0.01"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>

                {/* Cliente */}
                <FormInput
                    label="Cliente"
                    name="customer"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    required
                />

                {/* Asignar a */}
                <FormSelect
                    label="Asignar a"
                    name="assigned_to"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    loading={loadingUsers}
                    options={users.map((u) => ({
                        value: String(u.id),
                        label:
                            u.first_name && u.last_name
                                ? `${u.first_name} ${u.last_name}`
                                : u.username,
                    }))}
                />

                {/* Botones de acción */}
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
                        {loading ? "Guardando..." : "Crear Corte"}
                    </button>
                </div>

                {/* Mensaje de éxito */}
                {success && (
                    <SuccessMessage
                        message="Orden de corte creada exitosamente"
                        onClose={() => setSuccess(false)}
                    />
                )}
            </form>
        </Modal>
    );
};

CreateCuttingOrderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    subproduct: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        parent_type_name: PropTypes.string,
        parent_name: PropTypes.string,
        number_coil: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        brand: PropTypes.string,
    }).isRequired,
};

export default CreateCuttingOrderModal;
