// Método para el logout
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // Redirigir a la página de login si es necesario
  // Nota: No uses `window.location.href` aquí, ya que el hook `useAuth` maneja la navegación
};

export default {
  logoutUser
};
