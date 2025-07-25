// src/features/category/services/categories.js
import { djangoApi } from "@/api/clients";
import { buildQueryString } from "@/utils/queryUtils";

/**
 * 🗂️ Cache en memoria (opcional)
 */
const categoryCache = new Map();
export const getCachedCategories = (url) => categoryCache.get(url) || null;
export const setCachedCategories = (url, data) => categoryCache.set(url, data);
export const invalidateCachedCategoriesByUrl = (url) => categoryCache.delete(url);
export const clearCategoriesCache = () => categoryCache.clear();

/**
 * 📋 Listar categorías con paginación/filtros
 */
export const listCategories = async (params = {}) => {
  // construimos correctamente el query string
  const qs = buildQueryString(params);
  const url = `/inventory/categories/${qs}`;

  // memoria cache (opcional)
  const dataFromCache = getCachedCategories(url);
  if (dataFromCache) return dataFromCache;

  const { data } = await djangoApi.get(url);
  setCachedCategories(url, data);
  return data;
};

/**
 * 🆕 Crear nueva categoría
 */
export const createCategory = async (payload) => {
  const { data } = await djangoApi.post("/inventory/categories/create/", payload);
  clearCategoriesCache(); // invalidamos cache en memoria
  return data;            // devolvemos directamente data, no el objeto Axios completo
};

/**
 * ✏️ Actualizar categoría
 */
export const updateCategory = async (id, payload) => {
  const { data } = await djangoApi.put(`/inventory/categories/${id}/`, payload);
  clearCategoriesCache();
  return data;
};

/**
 * 🗑️ Eliminar (soft-delete) categoría
 */
export const deleteCategory = async (id) => {
  await djangoApi.delete(`/inventory/categories/${id}/`);
  clearCategoriesCache();
  return true;
};
