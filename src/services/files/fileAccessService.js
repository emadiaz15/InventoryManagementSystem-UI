import { djangoApi } from "@/api/clients";
import { getAccessToken, clearTokens } from "@/utils/sessionUtils";
import { parseJwt } from "@/utils/jwtUtils";

/** Verifica y refresca (o expira) el token JWT */
const verifyAccessToken = () => {
  const token = getAccessToken();
  if (!token) throw new Error("No se encontró accessToken");
  const { exp } = parseJwt(token) || {};
  if (!exp || Math.floor(Date.now() / 1000) >= exp) {
    clearTokens();
    window.dispatchEvent(new Event("sessionExpired"));
    throw new Error("Token expirado");
  }
  return token;
};

const getProductDownloadUrl = (productId, fileId) =>
  `/inventory/products/${productId}/files/${fileId}/download/`;

/**
 * Descarga protegido y convierte a blob URL.
 */
export const fetchProtectedFile = async (
  productId,
  fileId,
  subproductId = null,
  signal = null
) => {
  verifyAccessToken();
  const url = subproductId
    ? `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`
    : getProductDownloadUrl(productId, fileId);
  const res = await djangoApi.get(url, {
    responseType: "blob",
    signal,
  });
  return URL.createObjectURL(res.data);
};

/**
 * Si necesitas descargar cualquier blob a partir de URL externa.
 */
export const fetchProtectedBlob = async (url) => {
  verifyAccessToken();
  const res = await djangoApi.get(url, { responseType: "blob" });
  return URL.createObjectURL(res.data);
};
