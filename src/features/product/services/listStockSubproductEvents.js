import axios from "../../../services/api";

export const listStockSubproductEvents = async (productId, subproductId, startDate = null, endDate = null) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const url = `/api/v1/stocks/products/${productId}/subproducts/${subproductId}/stock/events/`;
  const response = await axios.get(url, { params });
  return response.data;
};
