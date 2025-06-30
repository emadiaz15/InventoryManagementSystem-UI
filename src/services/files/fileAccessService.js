import { djangoApi } from "@/api/clients";
import { getAccessToken, clearTokens } from "@/api/clients";
import { parseJwt } from "@/utils/jwtUtils";

// ─────────────────────────────────────────────────────────────
// 🔐 Verificación de JWT antes de cualquier request protegida
// ─────────────────────────────────────────────────────────────
const verifyAccessToken = () => {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error("❌ No accessToken found");

  const payload = parseJwt(accessToken);
  const now = Math.floor(Date.now() / 1000);
  if (!payload?.exp || now >= payload.exp) {
    clearTokens();
    window.dispatchEvent(new Event("sessionExpired"));
    throw new Error("⌛ Token expirado");
  }

  return accessToken;
};

// ─────────────────────────────────────────────────────────────
// 🛤️ URL Builders
// ─────────────────────────────────────────────────────────────
const getProductDownloadUrl = (productId, fileId) =>
  `/inventory/products/${productId}/files/${fileId}/download/`;

const getSubproductDownloadUrl = (productId, subproductId, fileId) =>
  `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`;

// ─────────────────────────────────────────────────────────────
// 📦 Descargar archivo protegido (producto o subproducto)
// ─────────────────────────────────────────────────────────────
export const fetchProtectedFile = async (
  productId,
  fileId,
  subproductId = null,
  signal = null
) => {
  verifyAccessToken();

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
      console.warn(`⛔ Descarga abortada: ${fileId}`);
      return null;
    }

    const status = err.response?.status || "???";
    const origin = subproductId ? "subproducto" : "producto";
    console.error(`❌ (${status}) Error descargando de ${origin} ${fileId}:`, err);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// 🖼️ Descargar imagen protegida o archivo desde URL absoluta
// ─────────────────────────────────────────────────────────────
export const fetchProtectedBlob = async (url) => {
  verifyAccessToken();

  try {
    const response = await djangoApi.get(url, {
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error(`❌ Error al descargar blob desde URL: ${url}`, err);
    return null;
  }
};

// ─────────────────────────────────────────────────────────────
// 🧪 Enriquecer archivos con blob URLs (producto o subproducto)
// ─────────────────────────────────────────────────────────────
export const enrichFilesWithBlobUrls = async ({
  productId,
  rawFiles = [],
  subproductId = null,
  signal = null,
}) => {
  if (!productId || !Array.isArray(rawFiles)) {
    console.warn("❌ Parámetros inválidos en enrichFilesWithBlobUrls:", { productId, rawFiles });
    return [];
  }

  const enriched = await Promise.all(
    rawFiles.map(async (f) => {
      const fileId = f.drive_file_id || f.id;

      if (!fileId || f?.mimeType === "application/vnd.google-apps.folder") return null;

      try {
        const url = await fetchProtectedFile(productId, fileId, subproductId, signal);
        return {
          ...f,
          id: fileId,
          url,
          filename: f.name || f.filename || "archivo_sin_nombre",
          contentType: f.mimeType || f.contentType || "application/octet-stream",
        };
      } catch (err) {
        console.error(`❌ Error enriqueciendo archivo ${fileId}:`, err);
        return null;
      }
    })
  );

  return enriched.filter((f) => f && f.url);
};
