// src/features/user/services/filterUsers.js
import { axiosInstance } from '../../../services/api';

/**
 * Retrieves a filtered list of users.
 *
 * @param {Object} filters - An object with filter key-value pairs (e.g., { is_active: "true", is_staff: "false" }).
 * @param {string} [url='/users/list/'] - (Optional) The endpoint URL. It can be modified if needed.
 * @returns {Promise<Object>} - The API response data.
 */
export const filterUsers = async (filters = {}, url = '/users/list/') => {
  // Build query parameters from the filters object
  const params = new URLSearchParams(filters).toString();
  const finalUrl = params ? `${url}?${params}` : url;

  try {
    const response = await axiosInstance.get(finalUrl);
    return response.data;
  } catch (error) {
    console.error('Error filtering users:', error.response?.data || error.message);
    throw error;
  }
};
