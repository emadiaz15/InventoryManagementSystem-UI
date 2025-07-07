import { djangoApi } from "@/api/clients";

export const listProducts = async (url = "/inventory/products/") => {
  if (typeof url !== "string" || !url.startsWith("/")) {
    throw new Error("❌ URL inválida para listar productos.");
  }

  try {
    const response = await djangoApi.get(url);
    if (response.data && Array.isArray(response.data.results)) {
      response.data.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error al obtener productos:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "Error al obtener la lista de productos."
    );
  }
};

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
    console.error(
      "❌ Error al crear el producto:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.detail || "No se pudo crear el producto."
    );
  }
};

export const updateProduct = async (productId, productData) => {
  if (!productId || typeof productData !== "object") {
    throw new Error("❌ Se requiere un productId y un objeto de datos válido.");
  }
  const id = String(productId).trim();

  try {
    const isForm = productData instanceof FormData;

    const response = await djangoApi.put(
      `/inventory/products/${id}/`,
      productData,
      isForm ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );

    return response.data;
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      error.message ||
      "No se pudo actualizar el producto.";
    console.error("❌ Error al actualizar el producto:", detail);
    throw new Error(detail);
  }
};

export const deleteProduct = async (productId) => {
  const id = String(productId).trim();
  try {
    const response = await djangoApi.delete(`/inventory/products/${id}/`);
    return response;
  } catch (error) {
    const detail = error.response?.data?.detail || "Error al eliminar el producto";
    throw new Error(detail);
  }
};
