import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/features/product/services/products/products";
import { buildQueryString } from "@/utils/queryUtils";
import { productKeys } from "@/features/product/utils/queryKeys";

const BASE_URL = "/inventory/products/";

/**
 * 📦 Listar productos con paginación y filtros
 */
export const useListProducts = (filters = {}, pageUrl = null) => {
  const queryClient = useQueryClient();
  const url = pageUrl || `${BASE_URL}${buildQueryString(filters)}`;

  const { data, isLoading, error } = useQuery({
    queryKey: productKeys.list(filters, pageUrl),
    queryFn: () => listProducts(typeof url === "string" ? url : filters),
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  return {
    products: data?.results ?? [],
    nextPageUrl: data?.next ?? null,
    previousPageUrl: data?.previous ?? null,
    loadingProducts: isLoading,
    fetchError: error,
  };
};

/**
 * ➕ Crear producto
 *
 * onSuccessCallback (optional): función a ejecutar tras crearse el producto
 */
export const useCreateProduct = (onSuccessCallback) => {
  const qc = useQueryClient();
  return useMutation(createProduct, {
    onSuccess: (newProduct) => {
      // Invalida cualquier consulta de productos para refrescar listas y detalles
      qc.invalidateQueries({
        predicate: (query) => productKeys.prefixMatch(query.queryKey),
      });
      // Llamada al callback del consumidor (cerrar modal, mostrar mensaje, etc)
      onSuccessCallback?.(newProduct);
    },
  });
};

/**
 * 📝 Actualizar producto
 *
 * onSuccessCallback (optional): función a ejecutar tras actualizarse el producto
 */
export const useUpdateProduct = (onSuccessCallback) => {
  const qc = useQueryClient();
  return useMutation(
    ({ productId, productData }) => updateProduct(productId, productData),
    {
      onSuccess: (updatedProduct, { productId }) => {
        // Invalida la lista y el detalle de este producto
        qc.invalidateQueries({
          predicate: (query) => productKeys.prefixMatch(query.queryKey),
        });
        qc.invalidateQueries(productKeys.detail(productId));
        onSuccessCallback?.(updatedProduct);
      },
    }
  );
};

/**
 * 🗑️ Eliminar producto
 *
 * onSuccessCallback (optional): función a ejecutar tras eliminarse el producto
 */
export const useDeleteProduct = (onSuccessCallback) => {
  const qc = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      // Invalida todas las consultas de productos para reflejar la eliminación
      qc.invalidateQueries({
        predicate: (query) => productKeys.prefixMatch(query.queryKey),
      });
      onSuccessCallback?.();
    },
  });
};
