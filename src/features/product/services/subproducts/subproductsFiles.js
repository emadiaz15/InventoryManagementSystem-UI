// src/features/product/services/subproducts/subproductsFiles.js

import { djangoApi } from "@/api/clients"
import { fetchProtectedFile } from "@/services/files/fileAccessService"

/**
 * 📥 Lista los archivos multimedia de un subproducto.
 */
export const listSubproductFiles = async (productId, subproductId) => {
  if (!productId || !subproductId) {
    throw new Error(
      "Faltan productId o subproductId para listar archivos del subproducto."
    )
  }

  try {
    const response = await djangoApi.get(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/`
    )
    return response.data?.files || []
  } catch (error) {
    const message =
      error.response?.data?.detail ||
      "Error desconocido al listar archivos del subproducto."
    console.error(`❌ listSubproductFiles:`, message)
    throw new Error(message)
  }
}

/**
 * 📤 Sube uno o varios archivos a un subproducto.
 */
export const uploadSubproductFiles = async (productId, subproductId, files) => {
  if (!productId || !subproductId || !files?.length) {
    throw new Error(
      "Faltan productId, subproductId o archivos para subir al subproducto."
    )
  }

  const formData = new FormData()
  files.forEach((file) => formData.append("file", file))

  try {
    const response = await djangoApi.post(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/upload/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    )
    return response.data
  } catch (error) {
    const detail =
      error.response?.data?.detail ||
      "No se pudo subir archivos del subproducto."
    console.error("❌ uploadSubproductFiles:", detail)
    throw new Error(detail)
  }
}

/**
 * 🗑️ Elimina un archivo multimedia de un subproducto.
 */
export const deleteSubproductFile = async (
  productId,
  subproductId,
  fileId
) => {
  if (!productId || !subproductId || !fileId) {
    throw new Error(
      "Faltan parámetros necesarios para eliminar archivo de subproducto."
    )
  }

  try {
    await djangoApi.delete(
      `/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/delete/`
    )
  } catch (error) {
    const reason =
      error.response?.data?.detail ||
      "Error al eliminar archivo de subproducto."
    console.error(`❌ deleteSubproductFile (${fileId}):`, reason)
    throw new Error(reason)
  }
}

/**
 * 🔽 Descarga un archivo multimedia de un subproducto (blob URL).
 */
export const downloadSubproductFile = async (
  productId,
  subproductId,
  fileId,
  signal = null
) => {
  if (!productId || !subproductId || !fileId) {
    console.warn(
      "⚠️ Faltan parámetros para descargar archivo de subproducto."
    )
    return null
  }

  try {
    // fetchProtectedFile ya verifica el token y convierte la respuesta a Blob URL
    return await fetchProtectedFile(
      productId,
      fileId,
      subproductId,
      signal
    )
  } catch (error) {
    console.error(
      `❌ downloadSubproductFile (${fileId}):`,
      error.message || error
    )
    return null
  }
}
