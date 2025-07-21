import { djangoApi } from "@/api/clients"
import { getAccessToken, clearTokens } from "@/utils/sessionUtils"
import { parseJwt } from "@/utils/jwtUtils"

/** Verifica JWT y despacha evento si expiró */
const verifyAccessToken = () => {
  const token = getAccessToken()
  if (!token) throw new Error("No se encontró accessToken")
  const payload = parseJwt(token)
  const now = Math.floor(Date.now() / 1000)
  if (!payload?.exp || now >= payload.exp) {
    clearTokens()
    window.dispatchEvent(new Event("sessionExpired"))
    throw new Error("Token expirado")
  }
  return token
}

const getProductDownloadUrl = (productId, fileId) =>
  `/inventory/products/${productId}/files/${fileId}/download/`

export const fetchProtectedFile = async (
  productId,
  fileId,
  subproductId = null,
  signal = null
) => {
  verifyAccessToken()
  const url = subproductId
    ? `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`
    : getProductDownloadUrl(productId, fileId)
  try {
    const res = await djangoApi.get(url, { responseType: "blob", signal })
    return URL.createObjectURL(res.data)
  } catch (err) {
    if (err.name === "AbortError") return null
    console.error("Error descargando archivo:", err)
    return null
  }
}

export const fetchProtectedBlob = async (url) => {
  verifyAccessToken()
  try {
    const res = await djangoApi.get(url, { responseType: "blob" })
    return URL.createObjectURL(res.data)
  } catch (err) {
    console.error("Error descargando blob:", err)
    return null
  }
}

export const enrichFilesWithBlobUrls = async ({
  productId,
  rawFiles = [],
  subproductId = null,
  signal = null,
}) => {
  if (!productId || !Array.isArray(rawFiles)) return []
  const enriched = await Promise.all(
    rawFiles.map(async (f) => {
      const id = f.drive_file_id || f.id
      if (!id || f.mimeType === "application/vnd.google-apps.folder") return null
      try {
        const url = await fetchProtectedFile(productId, id, subproductId, signal)
        return {
          ...f,
          id,
          url,
          filename: f.name || f.filename || "archivo",
          contentType: f.mimeType || f.contentType || "application/octet-stream",
        }
      } catch {
        return null
      }
    })
  )
  return enriched.filter(Boolean)
}
