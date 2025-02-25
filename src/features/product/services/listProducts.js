import { axiosInstance } from '../../../services/api';

const listProducts = async (url = '/inventory/products/', options = {}) => {
  try {
    console.log("📢 Solicitando productos a:", url);

    const token = sessionStorage.getItem("accessToken");
    console.log("🔑 Token de autenticación:", token);

    if (!token) {
      console.error("❌ No hay token disponible. El usuario puede no estar autenticado.");
      return {
        success: false,
        message: "No hay token de autenticación",
        status: 401,
      };
    }

    const headers = { Authorization: `Bearer ${token}` };
    console.log("📡 Headers enviados:", headers);

    const response = await axiosInstance.get(url, { ...options, headers });

    console.log("✅ Respuesta de la API:", response.data);

    return {
      success: true,
      products: response.data.results || [],
      total: response.data.count || 0,
      nextPage: response.data.next || null,
      prevPage: response.data.previous || null
    };
  } catch (error) {
    console.error("❌ Error en listProducts:", error.response?.data || error.message);

    return {
      success: false,
      message: error.response?.data?.detail || "Error desconocido",
      status: error.response?.status || 500,
    };
  }
};

export default listProducts;
