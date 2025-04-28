import axios from 'axios';
import { getFastapiToken } from './api';
import { parseJwt } from '../utils/jwtUtils'; 

export const fetchProtectedImage = async (url) => {
  const fastapiToken = getFastapiToken();

  if (!fastapiToken) {
    console.error('❌ No hay fastapiToken');
    throw new Error('Token no encontrado');
  }

  const payload = parseJwt(fastapiToken);
  const now = Math.floor(Date.now() / 1000);

  if (payload?.exp && now >= payload.exp) {
    console.warn('🚫 Token expirado al intentar fetchProtectedImage');
    clearTokens();
    window.dispatchEvent(new Event('sessionExpired'));
    throw new Error('Token expirado');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: {
        'x-api-key': `Bearer ${fastapiToken}`,
      },
    });

    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('❌ Error fetchProtectedImage', error);
    throw error;
  }
};
