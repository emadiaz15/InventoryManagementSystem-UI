import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";
import { listUsers } from "../../user/services/listUsers";
import { createCuttingOrder } from "../services/createCuttingOrder";
import Layout from "../../../pages/Layout";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

/**
 * Plantilla de página “Carrito de Órdenes de Corte”.
 * Aquí debes inyectar desde tu contexto o estado global el array `cartItems`
 * con los subproductos seleccionados. Cada item: { id, parent_name, number_coil, brand, quantity }.
 */
const CuttingOrderCart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // 👇 Sustituir esto por tu estado de “cart”
    const [cartItems, setCartItems] = useState([
        // Ejemplo:
        // { id: 1, parent_name: "Acero A36", number_coil: 123, brand: "Marca X", quantity: 2.5 },
    ]);

    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Carga administradores/operarios para el select “Asignar a”
    useEffect(() => {
        setLoadingUsers(true);
        listUsers("/users/list/?status=true")
            .then((data) => setUsers(data.results || []))
            .catch(() => setUsersError("No se pudieron cargar los usuarios."))
            .finally(() => setLoadingUsers(false));
    }, []);

    const handleQuantityChange = (idx, value) => {
        setCartItems((prev) =>
            prev.map((it, i) =>
                i === idx ? { ...it, quantity: value } : it
            )
        );
    };

    const handleRemove = (idx) => {
        setCartItems((prev) => prev.filter((_, i) => i !== idx));
    };

    const validate = () => {
        if (!orderNumber.trim()) {
            setError("El Número de Pedido es obligatorio.");
            return false;
        }
        if (!customer.trim()) {
            setError("El Cliente es obligatorio.");
            return false;
        }
        if (cartItems.length === 0) {
            setError("Debe haber al menos un subproducto en el carrito.");
            return false;
        }
        for (const it of cartItems) {
            if (!it.quantity || parseFloat(it.quantity) <= 0) {
                setError(`Cantidad inválida para la bobina ${it.number_coil}.`);
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
            order_number: parseInt(orderNumber, 10),
            customer: customer.trim(),
            assigned_to: assignedTo || null,
            items: cartItems.map((it) => ({
                subproduct: it.id,
                cutting_quantity: parseFloat(it.quantity),
            })),
        };

        setSubmitting(true);
        try {
            await createCuttingOrder(payload);
            setSuccessMsg("Orden de corte creada exitosamente.");
            // limpia carrito
            setCartItems([]);
            // opcional: redirigir a listado
            setTimeout(() => navigate("/cutting-orders"), 1500);
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                err.message ||
                "Error al crear la orden de corte."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="px-6 py-8">
                <h1 className="text-2xl font-bold mb-6 pt-9">Carrito de Órdenes de Corte</h1>

                {error && (
                    <ErrorMessage message={error} onClose={() => setError("")} />
                )}
                {usersError && (
                    <ErrorMessage message={usersError} onClose={() => setUsersError("")} />
                )}
                {successMsg && (
                    <SuccessMessage
                        message={successMsg}
                        onClose={() => setSuccessMsg("")}
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Datos de la orden */}
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
                        <p className="flex items-center">
                            <strong>Creado por:</strong>{" "}
                            <span className="ml-2">
                                {user?.first_name && user?.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : user.username}
                            </span>
                        </p>
                    </div>

                    {/* Tabla de subproductos */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Subproducto</th>
                                    <th className="px-4 py-2">Bobina N°</th>
                                    <th className="px-4 py-2">Marca</th>
                                    <th className="px-4 py-2">Cantidad (m)</th>
                                    <th className="px-4 py-2">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((it, idx) => (
                                    <tr key={it.id} className="border-t">
                                        <td className="px-4 py-2">{it.parent_name}</td>
                                        <td className="px-4 py-2">{it.number_coil}</td>
                                        <td className="px-4 py-2">{it.brand}</td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={it.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(idx, e.target.value)
                                                }
                                                className="w-20 border rounded p-1"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                type="button"
                                                onClick={() => handleRemove(idx)}
                                                className="text-red-600 hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {cartItems.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-6 text-center text-gray-500"
                                        >
                                            No hay subproductos en el carrito.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón de envío */}
                    <div className="flex justify-end">
                        <button type="submit" disabled={submitting || cartItems.length === 0}>
                            {submitting ? "Creando..." : "Crear Orden de Corte"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CuttingOrderCart;
