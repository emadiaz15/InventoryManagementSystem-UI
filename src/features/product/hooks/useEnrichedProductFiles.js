import { useMemo } from "react";

const getFileId = (file) => {
  if (!file) return "";
  return file.key || file.id || "";
};

export const useEnrichedProductFiles = (productId, rawFiles = []) => {
  const files = useMemo(() => {
    if (!productId || !Array.isArray(rawFiles)) return [];
    return rawFiles
      .filter((f) => f.url)
      .map((f) => ({
        ...f,
        id: getFileId(f),
        url: f.url,
        filename: f.name || f.filename || "archivo",
        contentType: f.mimeType || f.contentType || "application/octet-stream",
      }));
  }, [productId, rawFiles]);

  return {
    files,
    loading: false,
    loadError: null,
    refresh: () => {},
  };
};