import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../pages/Layout";
import { useAuth } from "../context/AuthProvider";
import KanbanCard from "../components/kanban/KanbanCard";
import KanbanColumn from "../components/kanban/KanbanColumn";

const dummyCuttingOrders = [
  {
    id: 1,
    state: "Orden Asignada",
    subproduct: 101,
    type: "Tipo A",
    name: "Subproducto A",
    description: "Descripción de Subproducto A",
    customer: "Cliente A",
    cutting_quantity: "100",
    assigned_to: "Operador 1",
    created_by: "Admin",
    created_at: "2025-03-26T23:58:48.661Z",
    modified_at: "2025-03-26T23:58:48.661Z",
  },
  {
    id: 2,
    state: "Orden en Proceso",
    subproduct: 102,
    type: "Tipo B",
    name: "Subproducto B",
    description: "Descripción de Subproducto B",
    customer: "Cliente B",
    cutting_quantity: "200",
    assigned_to: "Operador 2",
    created_by: "Admin",
    created_at: "2025-03-26T23:58:48.661Z",
    modified_at: "2025-03-26T23:58:48.661Z",
  },
  {
    id: 3,
    state: "Orden Completada",
    subproduct: 103,
    type: "Tipo C",
    name: "Subproducto C",
    description: "Descripción de Subproducto C",
    customer: "Cliente C",
    cutting_quantity: "150",
    assigned_to: "Operador 3",
    created_by: "Admin",
    created_at: "2025-03-26T23:58:48.661Z",
    modified_at: "2025-03-26T23:58:48.661Z",
  },
];

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cuttingOrders, setCuttingOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setCuttingOrders(dummyCuttingOrders);
  }, [isAuthenticated, navigate]);

  const ordersAsignada = cuttingOrders.filter(
    (order) => order.state === "Orden Asignada"
  );
  const ordersEnProceso = cuttingOrders.filter(
    (order) => order.state === "Orden en Proceso"
  );
  const ordersCompletada = cuttingOrders.filter(
    (order) => order.state === "Orden Completada"
  );

  return (
    // Dentro del return de Dashboard
    <Layout>
      <div className="p-10 mt-4">
        <h1 className="text-2xl font-bold text-start mb-6 text-gray-800">
          Órdenes de Corte
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KanbanColumn
            title="Pendiente"
            count={ordersAsignada.length}
            color="warning"
          >
            {ordersAsignada.length > 0 ? (
              ordersAsignada.map((order) => (
                <KanbanCard
                  key={order.id}
                  order={order}
                />
              ))
            ) : (
              <p className="text-gray-500">No hay órdenes asignadas.</p>
            )}
          </KanbanColumn>

          <KanbanColumn
            title="En Proceso"
            count={ordersEnProceso.length}
            color="success"
          >
            {ordersEnProceso.length > 0 ? (
              ordersEnProceso.map((order) => (
                <KanbanCard
                  key={order.id}
                  order={order}
                />
              ))
            ) : (
              <p className="text-gray-500">No hay órdenes en proceso.</p>
            )}
          </KanbanColumn>

          <KanbanColumn
            title="Completada"
            count={ordersCompletada.length}
            color="primary"
          >
            {ordersCompletada.length > 0 ? (
              ordersCompletada.map((order) => (
                <KanbanCard
                  key={order.id}
                  order={order}
                />
              ))
            ) : (
              <p className="text-gray-500">No hay órdenes completadas.</p>
            )}
          </KanbanColumn>
        </div>
      </div>
    </Layout>

  );
};

export default Dashboard;
