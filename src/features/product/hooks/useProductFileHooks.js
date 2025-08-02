// src/features/product/hooks/useProductFileHooks.js

import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  listProductFiles,
  uploadFileProduct,
  deleteProductFile,
  downloadProductFile,
} from "@/features/product/services/products/files"
import { productKeys } from "@/features/product/utils/queryKeys"

/**
 * Hook combinado para obtener raw + URLs blob de MinIO
 * @param {string|number|null} productId
 */
export function useProductFilesData(productId) {
  const filesKey = productKeys.files(productId)
  const blobKey = [...filesKey, "blob-urls"]

  // 1️⃣ Consulta metadatos en el backend
  const rawQuery = useQuery({
    queryKey: filesKey,
    queryFn: () => listProductFiles(productId),
    enabled: Boolean(productId),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  // 2️⃣ Para cada metadato, descargar blob protegido y generar URL
  const enrichedQuery = useQuery({
    queryKey: blobKey,
    queryFn: async () => {
      const raws = rawQuery.data || []
      const withUrls = await Promise.all(
        raws.map(async (file) => {
          const id = file.drive_file_id || file.id
          if (!id) return null
          try {
            const url = await downloadProductFile(productId, id)
            return {
              ...file,
              id,
              url,
              filename: file.name || file.filename || "",
              contentType: file.mimeType || file.contentType || "application/octet-stream",
            }
          } catch {
            return null
          }
        })
      )
      return withUrls.filter(Boolean)
    },
    enabled: rawQuery.isSuccess,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  return {
    rawFiles: rawQuery.data || [],
    rawStatus: rawQuery.status,
    rawError: rawQuery.error,

    files: enrichedQuery.data || [],
    status: enrichedQuery.status,
    error: enrichedQuery.error || rawQuery.error,

    isLoading: rawQuery.isLoading || enrichedQuery.isLoading,
    isError: rawQuery.isError || enrichedQuery.isError,
  }
}

/**
 * Hook para subir archivos a un producto con React Query.
 * @param {string|number} productId
 */
export function useUploadProductFiles(productId) {
  const qc = useQueryClient()
  const filesKey = productKeys.files(productId)
  const detailKey = productKeys.detail(productId)
  const [uploadError, setUploadError] = useState(null)

  const clearUploadError = useCallback(() => {
    setUploadError(null)
  }, [])

  const mutation = useMutation({
    mutationFn: (files) => uploadFileProduct(productId, files),
    onMutate: async (files) => {
      await qc.cancelQueries(filesKey)
      clearUploadError()
      const previous = qc.getQueryData(filesKey) || []

      const fileArray = Array.isArray(files) ? files : [files]
      const placeholders = fileArray
        .filter((f) => f instanceof File || f instanceof Blob)
        .map((f) => ({
          id: `tmp-${f.name}-${Date.now()}`,
          name: f.name,
          mimeType: f.type,
          url: URL.createObjectURL(f),
          isUploading: true,
        }))

      qc.setQueryData(filesKey, (old = []) => [...placeholders, ...old])
      return { previous }
    },
    onError: (err, _files, context) => {
      setUploadError(err?.message || "Error uploading files.")
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
    clearUploadError,
  }
}

/**
 * Hook para eliminar un archivo de un producto con React Query.
 * @param {string|number} productId
 */
export function useDeleteProductFile(productId) {
  const qc = useQueryClient()
  const filesKey = productKeys.files(productId)
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
