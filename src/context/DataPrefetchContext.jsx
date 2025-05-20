import { createContext, useContext, useState, useEffect } from "react";
import { listCategories } from "../features/category/services/listCategory";
import { listTypes } from "../features/type/services/listType";

const DataPrefetchContext = createContext();

export const DataPrefetchProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catResp, typeResp] = await Promise.all([
        listCategories("/inventory/categories/?limit=1000&status=true"),
        listTypes("/inventory/types/?limit=1000&status=true"),
      ]);

      setCategories(catResp.results || []);
      setTypes(
        typeResp.results ??
        typeResp.activeTypes ??
        (Array.isArray(typeResp) ? typeResp : [])
      );

      setLoaded(true);
    } catch (err) {
      console.error("❌ Prefetch fallido:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataPrefetchContext.Provider value={{ categories, types, loading, loaded }}>
      {children}
    </DataPrefetchContext.Provider>
  );
};

export const usePrefetchedData = () => useContext(DataPrefetchContext);
