// src/features/product/hooks/useProductFileHooks.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import {
  listProductFiles,
  uploadFileProduct,
  deleteProductFile
} from "@/features/product/services/products/files"
import { fetchProtectedFile } from "@/services/files/fileAccessService"
import { productKeys } from "@/features/product/utils/queryKeys"

/** Listar archivos multimedia de un producto */
export const useProductFiles = (productId) =>
  useQuery({
    queryKey: productKeys.files(productId),
    queryFn: () => listProductFiles(productId),
    enabled: !!productId,
  })

/** Subir archivos (hasta 5) a un producto */
export const useUploadProductFiles = () => {
  const qc = useQueryClient()
  const mut = useMutation({
    mutationFn: ({ productId, files }) => uploadFileProduct(productId, files),
    onSuccess: (_, { productId }) =>
      qc.invalidateQueries(productKeys.files(productId)),
  })

  return {
    uploadFiles: mut.mutateAsync,
    uploading: mut.isLoading,
    uploadError: mut.error,
    clearUploadError: mut.reset,
  }
}

/** Eliminar un archivo de un producto */
export const useDeleteProductFile = () => {
  const qc = useQueryClient()
  const mut = useMutation({
    mutationFn: ({ productId, fileId }) => deleteProductFile(productId, fileId),
    onSuccess: (_, { productId }) =>
      qc.invalidateQueries(productKeys.files(productId)),
  })

  return {
    deleteFile: mut.mutateAsync,
    deleting: mut.isLoading,
    deleteError: mut.error,
  }
}

/** Descargar un archivo protegido */
export const useDownloadProductFile = () => {
  const mut = useMutation({
    mutationFn: ({ productId, fileId, signal }) =>
      fetchProtectedFile(productId, fileId, null, signal),
  })

  return {
    downloadFile: mut.mutateAsync,
    status: mut.status,
    error: mut.error,
  }
}

/** Enriquecer archivos con URL de blob para mostrar previews */
export const useEnrichedProductFiles = (productId) => {
  const { data: rawFiles = [], status: listStatus } = useProductFiles(productId)
  const { downloadFile, status: downloadStatus, error: downloadError } =
    useDownloadProductFile()

  const files = useMemo(() => {
    if (listStatus !== "success") return []
    return rawFiles.map((f) => ({
      ...f,
      blobUrl: downloadFile({ productId, fileId: f.id }),
    }))
  }, [rawFiles, listStatus, downloadFile, productId])

  return {
    files,
    status: downloadStatus,
    error: downloadError,
  }
}
