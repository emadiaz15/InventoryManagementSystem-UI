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
 */
export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation(createProduct, {
    onSuccess: () => {
      qc.invalidateQueries({ predicate: productKeys.prefixMatch });
    },
  });
};

/**
 * 📝 Actualizar producto
 */
export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation(
    ({ productId, productData }) => updateProduct(productId, productData),
    {
      onSuccess: (_, { productId }) => {
        qc.invalidateQueries({ predicate: productKeys.prefixMatch });
        if (productId) {
          qc.invalidateQueries({ queryKey: productKeys.detail(productId) });
        }
      },
    }
  );
};

/**
 * 🗑️ Eliminar producto
 */
export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation(deleteProduct, {
    onSuccess: () => {
      qc.invalidateQueries({ predicate: productKeys.prefixMatch });
    },
  });
};
