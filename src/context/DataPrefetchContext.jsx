/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthProvider"
import { listCategories } from "@/features/category/services/categories"
import { listTypes } from "@/features/type/services/types"

const DataPrefetchContext = createContext({
  categories: [],
  types: [],
  loading: true,
  loaded: false,
})

export const DataPrefetchProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth()

  const {
    data: catData,
    isLoading: loadingCats,
  } = useQuery({
    queryKey: ["prefetch", "categories"],
    queryFn: () => listCategories({ /* vacío o solo page_size si lo quieres */ }),
    staleTime: 5 * 60 * 1000,
    enabled: !authLoading && isAuthenticated,
  })

  const {
    data: typeData,
    isLoading: loadingTypes,
  } = useQuery({
    queryKey: ["prefetch", "types"],
    queryFn: () => listTypes({ limit: 1000, status: true }),
    staleTime: 5 * 60 * 1000,
    enabled: !authLoading && isAuthenticated,
  })

  const categories = catData?.results || []
  const types =
    typeData?.results ??
    typeData?.activeTypes ??
    (Array.isArray(typeData) ? typeData : [])

  const loading = authLoading || loadingCats || loadingTypes
  const loaded = !loading && !!catData && !!typeData

  return (
    <DataPrefetchContext.Provider value={{ categories, types, loading, loaded }}>
      {children}
    </DataPrefetchContext.Provider>
  )
}

export const usePrefetchedData = () => {
  const ctx = useContext(DataPrefetchContext)
  if (!ctx) {
    throw new Error("usePrefetchedData debe usarse dentro de <DataPrefetchProvider>")
  }
  return ctx
}
