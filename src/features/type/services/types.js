// src/features/type/services/types.js
import { djangoApi } from "@/api/clients"
import { buildQueryString } from "@/utils/queryUtils"

/**
 * 📋 Listar tipos con filtros/paginación
 */
export const listTypes = async (params = {}) => {
  const qs = buildQueryString(params)
  const { data } = await djangoApi.get(`/inventory/types/${qs}`)
  return data
}

/**
 * 🆕 Crear tipo
 */
export const createType = async (payload) => {
  const { data } = await djangoApi.post("/inventory/types/create/", payload)
  return data
}

/**
 * ✏️ Actualizar tipo
 */
export const updateType = async (id, payload) => {
  const { data } = await djangoApi.put(`/inventory/types/${id}/`, payload)
  return data
}

/**
 * 🗑️ Eliminar (soft-delete) tipo
 */
export const deleteType = async (id) => {
  await djangoApi.delete(`/inventory/types/${id}/`)
  return true
}
