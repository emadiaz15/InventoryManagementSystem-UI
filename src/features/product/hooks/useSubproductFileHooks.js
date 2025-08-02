// src/features/product/hooks/useSubproductFileHooks.js

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listSubproductFiles,
  uploadSubproductFiles,
  deleteSubproductFile,
  downloadSubproductFile,        // <-- import correcto
} from "@/features/product/services/subproducts/subproductsFiles";
import { productKeys } from "@/features/product/utils/queryKeys";

/**
 * Hook unificado para obtener metadatos RAW y archivos ENRIQUECIDOS (blob URLs).
 */
export function useSubproductFilesData(productId, subproductId) {
  const listKey     = productKeys.subproductFiles(productId, subproductId);
  const enrichedKey = [...listKey, "enriched"];

  // 1️⃣ Query raw
  const rawQuery = useQuery({
    queryKey: listKey,
    queryFn: () => listSubproductFiles(productId, subproductId),
    enabled: !!productId && !!subproductId,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  // 2️⃣ Query enriched
  const enrichedQuery = useQuery({
    queryKey: enrichedKey,
    queryFn: async () => {
      const raw = rawQuery.data || [];
      const enriched = await Promise.all(
        raw.map(async (f) => {
          const id = f.drive_file_id || f.id || f.key;
          if (!id) return null;
          // uso del wrapper downloadSubproductFile
          const url = await downloadSubproductFile(productId, subproductId, id);
          if (!url) return null;
          return {
            ...f,
            id,
            url,
            filename:    f.name || f.filename || "",
            contentType: f.mimeType || f.contentType || "",
          };
        })
      );
      return enriched.filter(Boolean);
    },
    enabled: rawQuery.isSuccess,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  return {
    rawFiles:   rawQuery.data || [],
    rawStatus:  rawQuery.status,
    rawError:   rawQuery.error,

    files:      enrichedQuery.data || [],
    status:     enrichedQuery.status,
    error:      enrichedQuery.error || rawQuery.error,

    isLoading:  rawQuery.isLoading  || enrichedQuery.isLoading,
    isError:    rawQuery.isError    || enrichedQuery.isError,
  };
}

/**
 * Hook para subir archivos a un subproducto con optimistic updates.
 */
export function useUploadSubproductFiles(productId, subproductId) {
  const qc        = useQueryClient();
  const listKey   = productKeys.subproductFiles(productId, subproductId);
  const detailKey = productKeys.subproductDetail(productId, subproductId);

  return useMutation(
    (files) => uploadSubproductFiles(productId, subproductId, files),
    {
      onMutate: async (files) => {
        await qc.cancelQueries(listKey);
        const previous = qc.getQueryData(listKey) || [];
        const placeholders = files.map((file) => ({
          id:          `tmp-${file.name}-${Date.now()}`,
          name:        file.name,
          mimeType:    file.type,
          url:         URL.createObjectURL(file),
          isUploading: true,
        }));
        qc.setQueryData(listKey, (old = []) => [...placeholders, ...old]);
        return { previous };
      },
      onError: (_err, _files, context) => {
        if (context?.previous) {
          qc.setQueryData(listKey, context.previous);
        }
      },
      onSettled: () => {
        qc.invalidateQueries(listKey);
        qc.invalidateQueries(detailKey);
      },
    }
  );
}

/**
 * Hook para eliminar un archivo de un subproducto con optimistic updates.
 */
export function useDeleteSubproductFile(productId, subproductId) {
  const qc        = useQueryClient();
  const listKey   = productKeys.subproductFiles(productId, subproductId);
  const detailKey = productKeys.subproductDetail(productId, subproductId);

  return useMutation(
    (fileId) => deleteSubproductFile(productId, subproductId, fileId),
    {
      onMutate: async (fileId) => {
        await qc.cancelQueries(listKey);
        const previous = qc.getQueryData(listKey) || [];
        qc.setQueryData(listKey, (old = []) =>
          old.filter((f) => (f.id || f.key) !== fileId)
        );
        return { previous };
      },
      onError: (_err, _fileId, context) => {
        if (context?.previous) {
          qc.setQueryData(listKey, context.previous);
        }
      },
      onSettled: () => {
        qc.invalidateQueries(listKey);
        qc.invalidateQueries(detailKey);
      },
    }
  );
}

/**
 * Hook para descargar un archivo de subproducto (blob URL).
 */
export function useDownloadSubproductFile() {
  const [downloading, setDownloading]     = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const controllerRef                     = useRef(null);

  const downloadFile = useCallback(
    async (productId, subproductId, fileId) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setDownloading(true);
      setDownloadError(null);

      try {
        return await downloadSubproductFile(
          productId,
          subproductId,
          fileId,
          controller.signal
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setDownloadError(err.message || "Error descargando archivo");
        }
        return null;
      } finally {
        setDownloading(false);
      }
    },
    []
  );

  const abortDownload = () => controllerRef.current?.abort();

  return { downloadFile, downloading, downloadError, abortDownload };
}
