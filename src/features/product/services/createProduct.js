import { djangoApi } from "@/api/clients";

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

export default {
  createProduct,
};
