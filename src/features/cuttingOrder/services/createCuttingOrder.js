import { djangoApi } from "@/api/clients";

/**
 * Crea una nueva Orden de Corte.
 * @param {Object} params
 * @param {string} params.customer
 * @param {Array<{ subproduct: number, cutting_quantity: number }>} params.items
 * @param {number} [params.assigned_to]        // opcional, si quieres asignarla al crear
 * @param {string} [params.workflow_status]    // opcional, p.ej. 'pending'|'in_process'
 */
export async function createCuttingOrder({
  customer,
  items,
  assigned_to = undefined,
  workflow_status = undefined,
}) {
  // Construye el body mínimo que pide el serializer
  const payload = { customer, items };

  // Sólo añade estos campos si vienen
  if (assigned_to !== undefined) payload.assigned_to = assigned_to;
  if (workflow_status !== undefined) payload.workflow_status = workflow_status;

  // POST al endpoint de creación definido en Django:
  //   path('cutting-orders/create/', cutting_order_create)
  const { data } = await djangoApi.post(
    "/cutting/cutting-orders/create/",
    payload
  );
  return data;
}

export default createCuttingOrder;
