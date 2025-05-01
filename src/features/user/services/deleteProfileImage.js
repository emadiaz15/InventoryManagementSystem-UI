import axios from '../../../services/api';

export const deleteProfileImage = async (fileId) => {
  if (!fileId) throw new Error('ID de imagen no proporcionado');
  await axios.delete(`/users/image/${fileId}/delete/`);
};
