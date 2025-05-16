import { fetchProtectedFile } from "../../../services/mediaService";

/**
 * 📥 Descarga un archivo multimedia de un subproducto y devuelve una URL de blob.
 * @param {string|number} productId
 * @param {string|number} subproductId
 * @param {string} fileId
 * @param {'django'|'fastapi'} [source='django'] – el backend que sirve el archivo
 * @returns {Promise<string|null>} URL de blob o null si falla
 */
export const downloadSubproductFile = async (
  productId,
  subproductId,
  fileId,
  source = "django"
) => {
  return await fetchProtectedFile(productId, fileId, source, subproductId);
};
