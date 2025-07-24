// src/features/product/utils/queryKeys.js

export const productKeys = {
  /** Todas las queries relacionadas con "products" */
  all: ["products"],

  /** Listado de productos con filtros y paginación */
  list: (filters = {}, pageUrl = null) =>
    ["products", "list", filters, pageUrl],

  /** Detalle de un producto concreto */
  detail: (productId) =>
    ["products", "detail", productId],

  /** Archivos (media) de un producto */
  files: (productId) =>
    ["products", "files", productId],

  /** Listado de subproductos de un producto (paginado) */
  subproductList: (productId, pageUrl = null) =>
    ["products", productId, "subproducts", pageUrl],

  /** Detalle de un subproducto */
  subproductDetail: (productId, subproductId) =>
    ["products", productId, "subproducts", subproductId],

  /** Archivos (media) de un subproducto */
  subproductFiles: (productId, subproductId) =>
    ["products", productId, "subproducts", subproductId, "files"],

  /** Para invalidar todo lo que empiece por "products" */
  prefixMatch: (queryKey) =>
    Array.isArray(queryKey) && queryKey[0] === "products",
};
