import { djangoApi } from "@/api/clients";
import { getCachedUsers, setCachedUsers } from "./userCache";

export const listUsers = async (url = "/users/list/") => {
  const cached = getCachedUsers(url);
  if (cached) return cached;

  try {
    const response = await djangoApi.get(url);

    if (Array.isArray(response.data?.results)) {
      response.data.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setCachedUsers(url, response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al listar usuarios:", error);
    throw new Error("Error al listar usuarios");
  }
};
