// 🧠 Módulo de caché para categorías en memoria
const categoryCache = new Map();

/**
 * Obtiene categorías cacheadas para una URL.
 * @param {string} url
 * @returns {any|null}
 */
export const getCachedCategories = (url) => {
  return categoryCache.has(url) ? categoryCache.get(url) : null;
};

/**
 * Guarda categorías en caché para una URL.
 * @param {string} url
 * @param {any} data
 */
export const setCachedCategories = (url, data) => {
  categoryCache.set(url, data);
};

/**
 * Invalida una URL específica del caché.
 * @param {string} url
 */
export const invalidateCachedCategoriesByUrl = (url) => {
  categoryCache.delete(url);
};

/**
 * Limpia todo el caché de categorías.
 */
export const clearCategoriesCache = () => {
  categoryCache.clear();
};
