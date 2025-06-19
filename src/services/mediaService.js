import { djangoApi } from "@/services/clients";

// ─────────────────────────────────────────────────────────────
// 🛤️ URL Builders
// ─────────────────────────────────────────────────────────────
const getProductDownloadUrl = (productId, fileId) =>
  `/inventory/products/${productId}/files/${fileId}/download/`;

const getSubproductDownloadUrl = (productId, subproductId, fileId) =>
  `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`;

// ─────────────────────────────────────────────────────────────
// 🔒 Descargar archivo protegido (producto o subproducto)
// ─────────────────────────────────────────────────────────────
export const fetchProtectedFile = async (
  productId,
  fileId,
  subproductId = null,
  signal = null
) => {
  const url = subproductId
    ? getSubproductDownloadUrl(productId, subproductId, fileId)
    : getProductDownloadUrl(productId, fileId);

  try {
    const response = await djangoApi.get(url, {
      responseType: "blob",
      signal,
    });

    return URL.createObjectURL(response.data);
  } catch (err) {
    if (err.name === "AbortError") {
      console.warn(`⛔ Descarga abortada manualmente: ${fileId}`);
      return null;
    }

    const status = err.response?.status || "???";
    const origin = subproductId ? "subproducto" : "producto";
    console.error(
      `❌ (${status}) Error descargando archivo de ${origin} ${fileId}:`,
      err
    );

    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// 🖼️ Descargar archivo desde URL absoluta (e.g. imagen externa)
// ─────────────────────────────────────────────────────────────
export const fetchBlobFromUrl = async (url) => {
  try {
    const response = await djangoApi.get(url, {
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error(`❌ Error descargando blob desde URL absoluta: ${url}`, err);
    return null;
  }
};
