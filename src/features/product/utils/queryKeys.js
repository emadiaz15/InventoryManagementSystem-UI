export const productKeys = {
  all: ["products"],
  list: (filters = {}, page = null) => ["products", "list", filters, page],
  detail: (id) => ["products", "detail", id],
  /** 🔌 Archivos de un producto */
  files: (productId) => ["products", "files", productId],
  prefixMatch: (queryKey) =>
    Array.isArray(queryKey) && queryKey[0] === "products",
}