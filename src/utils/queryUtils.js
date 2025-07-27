/** src/utils/queryUtils.js
 * Genera una query string a partir de un objeto de filtros.
 * Ejemplo: { estado: "activo", page: 2 } → "?estado=activo&page=2"
 *
 * @param {Object} filterObj
 * @returns {string} Query string con ?
 */
export const buildQueryString = (filterObj = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(filterObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value);
    }
  });
  return queryParams.toString() ? `?${queryParams}` : "";
};
