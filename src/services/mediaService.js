// src/services/mediaService.js
import axios from 'axios';
import { getAccessToken, getFastapiToken } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getDjangoDownloadUrl = (productId, fileId) =>
  `${API_BASE_URL}/inventory/products/${productId}/files/${fileId}/download/`;

const getFastapiDownloadUrl = (productId, fileId) =>
  `${API_BASE_URL}/inventory/products/${productId}/files/${fileId}/download/`;


/**
 * 🔒 Descarga un archivo protegido para un producto desde FastAPI o Django.
 * Usa automáticamente el token correspondiente.
 */
export const fetchProtectedFile = async (productId, fileId, source = 'fastapi') => {
  const url =
    source === 'django'
      ? getDjangoDownloadUrl(productId, fileId)
      : getFastapiDownloadUrl(productId, fileId);

  const token =
    source === 'django' ? getAccessToken() : getFastapiToken();

  if (!token) return null;

  try {
    const res = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return URL.createObjectURL(res.data);
  } catch (err) {
    console.error(`❌ Error descargando archivo (${source}) ${fileId}:`, err);
    return null;
  }
};

/**
 * 📸 Descarga directa desde cualquier URL protegida.
 */
export const fetchBlobFromUrl = async (url) => {
  const token = url.includes('/api/v1/')
    ? getAccessToken()
    : getFastapiToken();

  if (!token) return null;

  try {
    const res = await axios.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return URL.createObjectURL(res.data);
  } catch (err) {
    console.error(`❌ Error descargando blob desde URL: ${url}`, err);
    return null;
  }
};
