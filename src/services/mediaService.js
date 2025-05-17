import { djangoApi, fastapiApi } from "@/services/clients";

const getProductDownloadUrl = (productId, fileId) =>
  `/inventory/products/${productId}/files/${fileId}/download/`;

const getSubproductDownloadUrl = (productId, subproductId, fileId) =>
  `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`;

/**
 * 🔒 Descarga un archivo protegido (producto o subproducto).
 */
export const fetchProtectedFile = async (
  productId,
  fileId,
  source = 'fastapi',
  subproductId = null,
  signal = null
) => {
  const url = subproductId
    ? getSubproductDownloadUrl(productId, subproductId, fileId)
    : getProductDownloadUrl(productId, fileId);

  const api = source === 'django' ? djangoApi : fastapiApi;

  try {
    const res = await api.get(url, {
      responseType: 'blob',
      signal,
    });
    return URL.createObjectURL(res.data);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`⛔ Descarga abortada: ${fileId}`);
      return null;
    }
    const status = err.response?.status || '---';
    console.error(`❌ (${status}) Error descargando archivo protegido (${source}) ${fileId}:`, err);
    return null;
  }
};

/**
 * 📸 Descarga un blob desde cualquier URL (por ejemplo, imagen de perfil).
 */
export const fetchBlobFromUrl = async (url) => {
  const isDjango = url.includes('/api/v1/');
  const api = isDjango ? djangoApi : fastapiApi;

  try {
    const res = await api.get(url, {
      responseType: 'blob',
    });
    return URL.createObjectURL(res.data);
  } catch (err) {
    console.error(`❌ Error descargando blob desde URL: ${url}`, err);
    return null;
  }
};