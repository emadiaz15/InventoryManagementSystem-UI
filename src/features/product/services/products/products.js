// src/features/product/services/products/products.js
import { djangoApi } from "@/api/clients";

/**
 * Obtener lista de productos con paginación y filtros opcionales
 * @param {Object|string} paramsOrUrl - Objeto de filtros o URL de paginación
 */
export const listProducts = async (paramsOrUrl = {}) => {
  try {
    const response =
      typeof paramsOrUrl === "string"
        ? await djangoApi.get(paramsOrUrl)
        : await djangoApi.get("/inventory/products/", { params: paramsOrUrl });

    const data = response.data;
    if (Array.isArray(data.results)) {
      data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return data;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    throw new Error(
      error.response?.data?.detail || "Error al obtener la lista de productos."
    );
  }
};

/**
 * Crear un nuevo producto
 * @param {Object|FormData} productData - Datos del producto o FormData con archivos
 */
export const createProduct = async (productData) => {
  if (
    !productData ||
    (typeof productData !== "object" && !(productData instanceof FormData))
  ) {
    throw new Error("Los datos del producto son inválidos.");
  }

  try {
    const config = productData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    const response = await djangoApi.post(
      "/inventory/products/create/",
      productData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el producto:", error);
    throw new Error(
      error.response?.data?.detail || "No se pudo crear el producto."
    );
  }
};

/**
 * Actualizar un producto existente
 * @param {number|string} productId - ID del producto
 * @param {Object|FormData} productData - Datos del producto o FormData con archivos
 */
export const updateProduct = async (productId, productData) => {
  if (
    !productId ||
    (typeof productData !== "object" && !(productData instanceof FormData))
  ) {
    throw new Error("❌ Se requiere un ID y datos válidos para actualizar.");
  }

  const id = String(productId).trim();

  try {
    const config = productData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    const response = await djangoApi.put(
      `/inventory/products/${id}/`,
      productData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    if (error.response?.status === 405) {
      throw new Error(
        `Método "PUT" no permitido (código ${error.response.status}). Verifica el endpoint en el backend.`
      );
    }
    throw new Error(
      error.response?.data?.detail || "No se pudo actualizar el producto."
    );
  }
};

/**
 * Eliminar un producto por ID
 * @param {number|string} productId - ID del producto a eliminar
 */
export const deleteProduct = async (productId) => {
  const id = String(productId).trim();

  try {
    const response = await djangoApi.delete(
      `/inventory/products/${id}/`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    throw new Error(
      error.response?.data?.detail || "No se pudo eliminar el producto."
    );
  }
};
