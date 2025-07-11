// src/features/user/services/userCache.js

// 🧠 Módulo de caché para servicios de usuario
const usersCache = new Map();

/**
 * Obtiene datos cacheados para una URL.
 * @param {string} url
 * @returns {any|null}
 */
export const getCachedUsers = (url) => {
  return usersCache.has(url) ? usersCache.get(url) : null;
};

/**
 * Guarda datos en caché para una URL.
 * @param {string} url
 * @param {any} data
 */
export const setCachedUsers = (url, data) => {
  usersCache.set(url, data);
};

/**
 * Invalida una URL específica del caché.
 * @param {string} url
 */
export const invalidateCachedUsersByUrl = (url) => {
  usersCache.delete(url);
};

/**
 * Limpia todo el caché de usuarios.
 */
export const clearUsersCache = () => {
  usersCache.clear();
};

export default {
  getCachedUsers,
  setCachedUsers,
  invalidateCachedUsersByUrl,
  clearUsersCache,
};
