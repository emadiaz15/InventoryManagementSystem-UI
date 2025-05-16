// src/services/mediaService.js
import axios from 'axios';
import { getAccessToken, getFastapiToken } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── CONSTRUCTORES DE URL ───────────────────────────────────────────────────────────────
// Archivos de producto (Django y FastAPI)
const getProductDownloadUrl = (productId, fileId) =>
  `${API_BASE_URL}/inventory/products/${productId}/files/${fileId}/download/`;

// Archivos de subproducto (Django y FastAPI)
const getSubproductDownloadUrl = (productId, subproductId, fileId) =>
  `${API_BASE_URL}/inventory/products/${productId}/subproducts/${subproductId}/files/${fileId}/download/`;

// ─── DESCARGA PROTEGIDA DE ARCHIVO ──────────────────────────────────────────────────────
/**
 * 🔒 Descarga un archivo protegido (producto o subproducto).
 *
 * @param {string} productId
 * @param {string} fileId
 * @param {'django'|'fastapi'} source    // backend de origen
 * @param {string} [subproductId]       // opcional para subproductos
 * @returns {Promise<string|null>} URL de blob o null
 */
export const fetchProtectedFile = async (
  productId,
  fileId,
  source = 'fastapi',
  subproductId = null
) => {
  // Elegir la URL correcta según si es producto o subproducto
  const url =
    subproductId
      ? getSubproductDownloadUrl(productId, subproductId, fileId)
      : getProductDownloadUrl(productId, fileId);

  // Seleccionar token según origen
  const token =
    source === 'django'
      ? getAccessToken()
      : getFastapiToken();

  if (!token) return null;

  try {
    const res = await axios.get(url, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` },
    });
    return URL.createObjectURL(res.data);
  } catch (err) {
    console.error(`❌ Error descargando archivo protegido (${source}) ${fileId}:`, err);
    return null;
  }
};

// ─── DESCARGA DE BLOB DESDE CUALQUIER URL ─────────────────────────────────────────────
/**
 * 📸 Descarga un blob desde cualquier URL (por ejemplo, imagen de perfil).
 *
 * @param {string} url
 * @returns {Promise<string|null>} URL de blob o null
 */
export const fetchBlobFromUrl = async (url) => {
  // Decidir token basado en si es endpoint Django o FastAPI
  const token = url.includes('/api/v1/')
    ? getAccessToken()
    : getFastapiToken();

  if (!token) return null;

  try {
    const res = await axios.get(url, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` },
    });
    return URL.createObjectURL(res.data);
  } catch (err) {
    console.error(`❌ Error descargando blob desde URL: ${url}`, err);
    return null;
  }
};
