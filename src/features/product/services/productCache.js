// 🧠 Módulo de caché para productos en memoria
const productCache = new Map();

export const getCachedProducts = (url) => {
  return productCache.has(url) ? productCache.get(url) : null;
};

export const setCachedProducts = (url, data) => {
  productCache.set(url, data);
};

export const invalidateCachedProductsByUrl = (url) => {
  productCache.delete(url);
};

export const clearProductsCache = () => {
  productCache.clear();
};
