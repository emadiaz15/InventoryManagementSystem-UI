import { axiosInstance } from "../services/api";

export const logoutHelper = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) return;

  try {
    await axiosInstance.post("/users/logout/", {
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error("Error en logoutHelper:", error);
  } finally {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("fastapiToken");
  }
};
