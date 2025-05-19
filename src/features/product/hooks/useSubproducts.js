const buildQueryString = (filtersObj) => {
  const params = new URLSearchParams();
  Object.entries(filtersObj).forEach(([key, value]) => {
    if (value !== "") params.append(key, value);
  });
  return params.toString() ? `?${params.toString()}` : "";
};

const fetchSubproducts = async (url = null) => {
  setLoading(true);
  setError(null);
  try {
    const query = buildQueryString(filters);
    const baseUrl = `/inventory/products/${productId}/subproducts/`;
    const fullUrl = url || `${baseUrl}${query ? `${query}` : ""}`;
    const data = await listSubproducts(productId, fullUrl);
    setSubproducts(data.results || []);
    setNextPage(data.next);
    setPreviousPage(data.previous);
  } catch {
    setError("Error al obtener los subproductos.");
  } finally {
    setLoading(false);
  }
};
