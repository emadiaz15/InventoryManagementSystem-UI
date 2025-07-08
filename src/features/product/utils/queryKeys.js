export const productKeys = {
  all: ["products"],
  list: (filters = {}, page = null) => ["products", "list", filters, page],
  detail: (id) => ["products", "detail", id],
  prefixMatch: (queryKey) =>
    Array.isArray(queryKey) && queryKey[0] === "products",
};