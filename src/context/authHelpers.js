import { axiosInstance } from "../services/api";

export const logoutHelper = async () => {
  try {
    await axiosInstance.post("/users/logout/");
  } catch (error) {
    console.error("Error en logoutHelper:", error);
  } finally {
    sessionStorage.removeItem("accessToken");
  }
};
