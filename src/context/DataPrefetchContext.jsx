import { createContext, useContext } from "react";
import { useQuery } from '@tanstack/react-query';
import { listCategories } from "../features/category/services/listCategory";
import { listTypes } from "../features/type/services/listType";

const DataPrefetchContext = createContext();

export const DataPrefetchProvider = ({ children }) => {
  const { data: catData, isLoading: loadingCats } = useQuery({
    queryKey: ['prefetch', 'categories'],
    queryFn: () => listCategories('/inventory/categories/?limit=1000&status=true'),
  });

  const { data: typeData, isLoading: loadingTypes } = useQuery({
    queryKey: ['prefetch', 'types'],
    queryFn: () => listTypes('/inventory/types/?limit=1000&status=true'),
  });

  const categories = catData?.results || [];
  const types = typeData?.results ?? typeData?.activeTypes ?? (Array.isArray(typeData) ? typeData : []);
  const loading = loadingCats || loadingTypes;
  const loaded = !!catData && !!typeData;

  return (
    <DataPrefetchContext.Provider value={{ categories, types, loading, loaded }}>
      {children}
    </DataPrefetchContext.Provider>
  );
};

export const usePrefetchedData = () => useContext(DataPrefetchContext);
