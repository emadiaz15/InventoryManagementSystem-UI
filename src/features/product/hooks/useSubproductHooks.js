import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listSubproducts,
  createSubproduct,
  updateSubproduct,
  deleteSubproduct,
} from "@/features/product/services/subproducts/subproducts";
import { fetchProtectedFile } from "@/services/files/fileAccessService";
import { buildQueryString } from "@/utils/queryUtils";

// 📄 Listar subproductos de un producto
export const useListSubproducts = (productId, filters = { page_size: 8, status: "true" }) => {
  const queryString = buildQueryString(filters);
  const fullUrl = `/inventory/products/${productId}/subproducts/${queryString}`;

  return useQuery({
    queryKey: ["subproducts", productId, filters],
    queryFn: () => listSubproducts(productId, fullUrl),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

// ➕ Crear subproducto
export const useCreateSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => createSubproduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "subproducts" && query.queryKey[1] === productId,
      });
    },
  });
};

// ✏️ Actualizar subproducto
export const useUpdateSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ subproductId, formData }) =>
      updateSubproduct(productId, subproductId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "subproducts" && query.queryKey[1] === productId,
      });
    },
  });
};

// 🗑️ Eliminar subproducto
export const useDeleteSubproduct = (productId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subproductId) => deleteSubproduct(productId, subproductId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "subproducts" && query.queryKey[1] === productId,
      });
    },
  });
};

// 🧪 Enriquecer archivos de subproducto con blob URL
export const useEnrichedSubproductFiles = (productId, subproductId, rawFiles = []) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const enrichFiles = useCallback(async () => {
    if (!productId || !subproductId || !Array.isArray(rawFiles)) return;

    setLoading(true);
    setLoadError(null);

    try {
      const enriched = await Promise.all(
        rawFiles.map(async (f) => {
          const fileId = f.key || f.id || f.drive_file_id;
          const url = f.url || (await fetchProtectedFile(productId, fileId, subproductId));

          return {
            ...f,
            id: fileId,
            url,
            filename: f.name || f.filename || "archivo",
            contentType: f.mimeType || f.contentType || "application/octet-stream",
          };
        })
      );
      setFiles(enriched.filter((f) => f.url));
    } catch (err) {
      console.error("❌ Error enriqueciendo archivos:", err);
      setLoadError("No se pudieron cargar los archivos multimedia.");
    } finally {
      setLoading(false);
    }
  }, [productId, subproductId, rawFiles]);

  useEffect(() => {
    enrichFiles();
  }, [enrichFiles]);

  return {
    files,
    loading,
    loadError,
    refresh: enrichFiles,
  };
};
