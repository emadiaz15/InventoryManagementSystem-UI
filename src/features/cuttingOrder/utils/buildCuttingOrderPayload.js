/**
 * Genera el payload para crear o actualizar una orden de corte.
 * @param {Object} params
 * @param {string|number} params.order_number
 * @param {string} params.customer
 * @param {Array<{ subproduct: number, cutting_quantity: number }>} params.items
 * @param {number|string|null} [params.assigned_to]
 * @param {string} [params.workflow_status] - Ej: "pending"
 * @returns {Object} payload listo para enviar por HTTP
 */
export const buildCuttingOrderPayload = ({
  order_number,
  customer,
  items,
  assigned_to = null,
  workflow_status = undefined,
}) => {
  const payload = {
    customer: customer.trim(),
    items: items
      .filter(it => it.subproduct && it.cutting_quantity > 0)
      .map(it => ({
        subproduct: parseInt(it.subproduct),
        cutting_quantity: parseFloat(it.cutting_quantity),
      })),
  };

  if (order_number !== undefined && order_number !== "") {
    payload.order_number = parseInt(order_number, 10);
  }

  if (assigned_to) {
    payload.assigned_to = assigned_to;
  }

  if (workflow_status) {
    payload.workflow_status = workflow_status;
  }

  return payload;
};
