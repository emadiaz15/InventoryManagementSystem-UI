export const productKeys = {
  all: ["products"],
  list: (filters = {}, page = null) => ["products", filters, page],
  detail: (productId) => ["product", productId],
  prefixMatch: (queryKey) => Array.isArray(queryKey) && queryKey[0] === "products",
};
