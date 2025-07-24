import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../pages/Layout";
import Toolbar from "../../../components/common/Toolbar";
import Table from "../../../components/common/Table";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../../../context/AuthProvider";
import { listUsers } from "../../user/services/listUsers";
import createCuttingOrder from "../services/createCuttingOrder";

const CuttingOrderCart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Items en el carrito (se espera que los pushes al carrito los guardes en localStorage)
    const [cartItems, setCartItems] = useState([]);
    const [orderNumber, setOrderNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Carga inicial del carrito desde localStorage
    useEffect(() => {
        const saved = localStorage.getItem("cuttingCart");
        setCartItems(saved ? JSON.parse(saved) : []);
    }, []);

    // Carga lista de usuarios activos para “Asignar a”
    useEffect(() => {
        setLoadingUsers(true);
        listUsers("/users/list/?status=true")
            .then((data) => setUsers(data.results || []))
            .catch(() => setError("No se pudieron cargar los usuarios."))
            .finally(() => setLoadingUsers(false));
    }, []);

    // Quitar item del carrito
    const handleRemove = (subproductId) => {
        const next = cartItems.filter((x) => x.id !== subproductId);
        setCartItems(next);
        localStorage.setItem("cuttingCart", JSON.stringify(next));
    };

    // Enviar la orden completa
    const handleSubmit = async () => {
        setError("");
        if (!customer.trim()) {
            setError("Debes indicar un cliente.");
            return;
        }
        if (cartItems.length === 0) {
            setError("El carrito está vacío.");
            return;
        }
        const payload = {
            order_number: orderNumber ? parseInt(orderNumber, 10) : undefined,
            customer: customer.trim(),
            assigned_to: assignedTo || null,
            items: cartItems.map((it) => ({
                subproduct: it.id,
                cutting_quantity: it.quantity,
            })),
        };

        setSubmitting(true);
        try {
            await createCuttingOrder(payload);
            setSuccess(true);
            localStorage.removeItem("cuttingCart");
            setCartItems([]);
            // Redirigir tras éxito
            setTimeout(() => navigate("/cutting-orders"), 1500);
        } catch (err) {
            setError(err.response?.data?.detail || err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Configuración de la tabla
    const headers = ["Subproducto", "Cantidad", "Acciones"];
    const rows = cartItems.map((it) => ({
        Subproducto: it.name,
        Cantidad: it.quantity,
        Acciones: (
            <button
                className="text-red-500 hover:underline"
                onClick={() => handleRemove(it.id)}
            >
                Eliminar
            </button>
        ),
    }));

    return (
        <Layout isLoading={submitting || loadingUsers}>
            <Toolbar
                title="Carrito de Corte"
                buttonText="Volver"
                onButtonClick={() => navigate(-1)}
            />

            {error && <ErrorMessage message={error} onClose={() => setError("")} />}
            {submitting && <Spinner size="6" color="text-primary-500" />}
            {success && (
                <SuccessMessage
                    message="Orden creada con éxito"
                    onClose={() => setSuccess(false)}
                />
            )}

            {cartItems.length > 0 ? (
                <Table headers={headers} rows={rows} />
            ) : (
                <p className="p-4 text-center text-gray-500">
                    El carrito está vacío.
                </p>
            )}

            <div className="space-y-4 p-4 bg-white rounded shadow mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Número de Pedido"
                        name="order_number"
                        type="number"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                    />
                    <FormInput
                        label="Cliente"
                        name="customer"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        required
                    />
                </div>

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

                <div className="flex justify-end">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={handleSubmit}
                        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                    >
                        {submitting ? "Enviando..." : "Crear Orden de Corte"}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default CuttingOrderCart;
