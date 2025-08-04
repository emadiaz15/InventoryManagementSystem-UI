import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProductFiles,
  uploadFileProduct,
  deleteProductFile,
} from "@/features/product/services/products/files";
import { productKeys } from "@/features/product/utils/queryKeys";

/**
 * Hook combinado para obtener metadatos + URLs presignadas de MinIO
 * @param {string|number|null} productId
 */
export function useProductFilesData(productId) {
  const qc = useQueryClient();
  const filesKey = productKeys.files(productId);

  // 1️⃣ Query de metadatos (ya incluye la URL presignada en `url`)
  const {
    data: rawFiles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: filesKey,
    queryFn: () => listProductFiles(productId),
    enabled: Boolean(productId),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  // 2️⃣ Mapeamos al formato que espera el carrusel
  const files = rawFiles.map((f) => ({
    id: f.key,                                   // clave en MinIO
    url: f.url,                                  // URL presignada para <img src=...>
    filename: f.name || f.filename || "",
    contentType: f.mimeType || f.contentType,
  }));

  return {
    rawFiles,
    files,
    isLoading,
    isError,
    error,
  };
}

/**
 * Hook para subir archivos a un producto con React Query.
 */
export function useUploadProductFiles(productId) {
  const qc = useQueryClient();
  const filesKey = productKeys.files(productId);
  const detailKey = productKeys.detail(productId);

  const mutation = useMutation({
    mutationFn: (files) => uploadFileProduct(productId, files),
    onSuccess: () => {
      qc.invalidateQueries(filesKey);
      qc.invalidateQueries(detailKey);
    },
  });

  return {
    uploadFiles: mutation.mutateAsync,
    uploading: mutation.isLoading,
    uploadError: mutation.error,
  };
}

/**
 * Hook para eliminar un archivo de un producto.
 */
export function useDeleteProductFile(productId) {
  const qc = useQueryClient();
  const filesKey = productKeys.files(productId);
  const detailKey = productKeys.detail(productId);

  const mutation = useMutation({
    mutationFn: (fileId) => deleteProductFile(productId, fileId),
    onMutate: async (fileId) => {
      await qc.cancelQueries(filesKey);
      const previous = qc.getQueryData(filesKey) || [];
      qc.setQueryData(filesKey, (old = []) =>
        old.filter((f) => f.id !== fileId)
      );
      return { previous };
    },
    onError: (_err, _fileId, context) => {
      if (context?.previous) {
        qc.setQueryData(filesKey, context.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries(filesKey);
      qc.invalidateQueries(detailKey);
    },
  });

  return {
    deleteFile: mutation.mutateAsync,
    deleting: mutation.isLoading,
    deleteError: mutation.error,
  };
}
