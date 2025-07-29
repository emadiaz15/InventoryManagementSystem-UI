import { useState } from "react" // ⬅️ necesario para manejar el estado local
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listProductFiles,
  enrichFilesWithBlobUrls,
  uploadFileProduct,
  deleteProductFile,
} from "@/features/product/services/products/files"
import { productKeys } from "@/features/product/utils/queryKeys"

/**
 * Hook combinado para obtener raw + enriched files de un producto.
 * @param {string|number|null} productId
 */
export function useProductFilesData(productId) {
  const filesKey    = productKeys.files(productId)
  const enrichedKey = [...filesKey, "enriched"]

  // 1️⃣ RAW: metadatos
  const rawQuery = useQuery({
    queryKey: filesKey,
    queryFn: () => listProductFiles(productId),
    enabled: Boolean(productId),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  // 2️⃣ ENRICHED: blob URLs + filename + contentType
  const enrichedQuery = useQuery({
    queryKey: enrichedKey,
    queryFn: () =>
      enrichFilesWithBlobUrls({
        productId,
        rawFiles: rawQuery.data || [],
      }),
    enabled: Boolean(productId) && rawQuery.isSuccess,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  return {
    // RAW
    rawFiles:   rawQuery.data || [],
    rawStatus:  rawQuery.status,
    rawError:   rawQuery.error,

    // ENRICHED
    files:      enrichedQuery.data || [],
    status:     enrichedQuery.status,
    error:      enrichedQuery.error || rawQuery.error,

    // Flags útiles
    isLoading:  rawQuery.isLoading  || enrichedQuery.isLoading,
    isError:    rawQuery.isError    || enrichedQuery.isError,
  }
}

/**
 * Hook para subir archivos a un producto con React Query.
 * Incluye optimistic update + rollback + invalidación.
 * @param {string|number} productId
 */
export function useUploadProductFiles(productId) {
  const qc = useQueryClient()
  const filesKey  = productKeys.files(productId)
  const detailKey = productKeys.detail(productId)

  const [uploadError, setUploadError] = useState(null) // ⬅️ estado para manejar errores

  const mutation = useMutation({
    mutationFn: (files) => uploadFileProduct(productId, files),
    onMutate: async (files) => {
      await qc.cancelQueries(filesKey)
      setUploadError(null) // limpiar errores anteriores
      const previous = qc.getQueryData(filesKey) || []

      // placeholders
      const placeholders = files.map((file) => ({
        id:          `tmp-${file.name}-${Date.now()}`,
        name:        file.name,
        mimeType:    file.type,
        url:         URL.createObjectURL(file),
        isUploading: true,
      }))

      qc.setQueryData(filesKey, (old = []) => [
        ...placeholders,
        ...old,
      ])
      return { previous }
    },
    onError: (err, _files, context) => {
      setUploadError(err?.message || "Error uploading files.") // setear error
      if (context?.previous) {
        qc.setQueryData(filesKey, context.previous)
      }
    },
    onSettled: () => {
      qc.invalidateQueries(filesKey)
      qc.invalidateQueries(detailKey)
    },
  })

  return {
    uploadFiles: mutation.mutateAsync,
    uploading: mutation.isLoading,
    uploadError,
    clearUploadError: () => setUploadError(null), // función expuesta para limpiar error
  }
}

/**
 * Hook para eliminar un archivo de un producto con React Query.
 * Incluye optimistic update + rollback + invalidación.
 * @param {string|number} productId
 */
export function useDeleteProductFile(productId) {
  const qc        = useQueryClient()
  const filesKey  = productKeys.files(productId)
  const detailKey = productKeys.detail(productId)

  return useMutation({
    mutationFn: (fileId) => deleteProductFile(productId, fileId),
    onMutate: async (fileId) => {
      await qc.cancelQueries(filesKey)
      const previous = qc.getQueryData(filesKey) || []

      qc.setQueryData(filesKey, (old = []) =>
        old.filter((f) => (f.id || f.key) !== fileId)
      )
      return { previous }
    },
    onError: (_err, _fileId, context) => {
      if (context?.previous) {
        qc.setQueryData(filesKey, context.previous)
      }
    },
    onSettled: () => {
      qc.invalidateQueries(filesKey)
      qc.invalidateQueries(detailKey)
    },
  })
}
