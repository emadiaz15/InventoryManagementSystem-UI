import { djangoApi } from "@/api/clients";

// Obtener lista de productos con paginación y filtros opcionales
export const listProducts = async (paramsOrUrl = {}) => {
  try {
    let response;

    if (typeof paramsOrUrl === "string") {
      // You passed a full URL (for next/previous pages)
      response = await djangoApi.get(paramsOrUrl);
    } else {
      // You passed a params object (initial load, filters, etc)
      response = await djangoApi.get("/inventory/products/", { params: paramsOrUrl });
    }

    const data = response.data;

    if (data && Array.isArray(data.results)) {
      data.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    return data;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    throw new Error(
      error.response?.data?.detail ||
        "Error al obtener la lista de productos."
    );
  }
};

// Crear un nuevo producto
export const createProduct = async (productData) => {
  if (!productData || typeof productData !== "object") {
    throw new Error("Los datos del producto son inválidos.");
  }

  try {
    const response = await djangoApi.post(
      "/inventory/products/create/",
      productData
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear el producto:", error);
    throw new Error(
      error.response?.data?.detail || "No se pudo crear el producto."
    );
  }
};

// Actualizar un producto existente
export const updateProduct = async (productId, productData) => {
  if (!productId || typeof productData !== "object") {
    throw new Error("❌ Se requiere un ID y datos válidos para actualizar.");
  }

  const id = String(productId).trim();

  try {
    const response = await djangoApi.put(
      `/inventory/products/${id}/`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    throw new Error(
      error.response?.data?.detail || "No se pudo actualizar el producto."
    );
  }
};

// Eliminar un producto por ID
export const deleteProduct = async (productId) => {
  const id = String(productId).trim();

  try {
    const response = await djangoApi.delete(`/inventory/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    throw new Error(
      error.response?.data?.detail || "No se pudo eliminar el producto."
    );
  }
};
