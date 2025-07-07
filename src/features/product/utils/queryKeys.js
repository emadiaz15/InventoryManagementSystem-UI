export const productKeys = {
  all: ["products"],
  list: (filters = {}, page = null) => ["products", filters, page],
  detail: (id) => ["product", id],
  prefixMatch: (queryKey) => Array.isArray(queryKey) && queryKey[0] === "products",
};
