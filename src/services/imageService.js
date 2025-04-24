import axios from 'axios';
import { getFastapiToken } from './api';

/**
 * Descarga una imagen protegida desde FastAPI usando el token JWT válido.
 * 
 * @param {string} url - URL completa al endpoint de FastAPI (por ejemplo: https://fastapi-url/profile/download/...)
 * @returns {Promise<string>} - URL temporal para usar en <img src="...">
 */
export const fetchProtectedImage = async (url) => {
  const fastapiToken = getFastapiToken();

  console.log('📦 Intentando fetchProtectedImage');
  console.log('👉 URL:', url);
  console.log('🔐 Token enviado en header x-api-key:', fastapiToken?.slice(0, 30) + '...');

  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        'x-api-key': `Bearer ${fastapiToken}`,
      },
    });

    console.log('✅ Imagen obtenida correctamente');
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('❌ Error al obtener la imagen:', error);
    throw error;
  }
};
