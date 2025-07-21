import React, { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import Toolbar from "@/components/common/Toolbar"
import SuccessMessage from "@/components/common/SuccessMessage"
import ErrorMessage from "@/components/common/ErrorMessage"
import Filter from "@/components/ui/Filter"
import Layout from "@/pages/Layout"
import Spinner from "@/components/ui/Spinner"
import TypeTable from "../components/TypeTable"
import TypeModals from "../components/TypeModals"

import { useTypes } from "../hooks/useTypes"
import useTypeModal from "../hooks/useTypeModal"
import { listCategories } from "@/features/category/services/categories"

const TypeList = () => {
  const navigate = useNavigate()

  // 1️⃣ Estados locales
  const [filters, setFilters] = useState({ name: "", category: "" })
  const [successMessage, setSuccessMessage] = useState("")

  // 2️⃣ Control de modales
  const { modalState, openModal, closeModal } = useTypeModal()

  // 3️⃣ Hook de tipos (listado + CRUD + paginación)
  const {
    types,
    loading: loadingTypes,
    isError: typesError,
    error: typesErrorMsg,
    nextPageUrl,
    previousPageUrl,
    createType,
    updateType,
    deleteType,
    prefetchPage,
  } = useTypes(filters)

  // 4️⃣ Precarga categorías (hasta 1000 activas),
  //    con catPage default para evitar undefined
  const {
    data: catPage = { results: [] },
    isLoading: loadingCategories,
    isError: categoriesError,
    error: categoriesErrorMsg,
  } = useQuery({
    queryKey: ["categories", { limit: 1000, status: true }],
    queryFn: () => listCategories({ limit: 1000, status: true }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  // Ahora catPage siempre al menos { results: [] }
  const categories = catPage.results

  // 5️⃣ Mensaje de éxito tras acción
  const handleActionSuccess = (msg) => {
    setSuccessMessage(msg)
    closeModal()
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  // 6️⃣ CRUD Handlers
  const handleCreateType = async (payload) => {
    try {
      const created = await createType(payload)
      handleActionSuccess(`Tipo "${created.name}" creado.`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateType = async (id, payload) => {
    try {
      const updated = await updateType(id, payload)
      handleActionSuccess(`Tipo "${updated.name}" actualizado.`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteType = async ({ id, name }) => {
    try {
      await deleteType(id)
      handleActionSuccess(`Tipo "${name}" eliminado.`)
    } catch (err) {
      console.error(err)
    }
  }

  // 7️⃣ Filtro personalizado
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  // 8️⃣ Columnas del Filter
  const filterColumns = useMemo(
    () => [
      { key: "name", label: "Tipo", filterType: "text" },
      {
        key: "category",
        label: "Categoría",
        filterType: "select",
        options: [
          { value: "", label: "Todas" },
          ...categories.map((c) => ({ value: c.id.toString(), label: c.name })),
        ],
      },
    ],
    [categories]
  )

  // 9️⃣ Función para mostrar nombre de categoría
  const getCategoryName = useCallback(
    (catId) => categories.find((c) => c.id === catId)?.name || "SIN CATEGORÍA",
    [categories]
  )

  return (
    <>
      <Layout>
        {/* Éxito */}
        {successMessage && (
          <div className="fixed top-20 right-5 z-50">
            <SuccessMessage
              message={successMessage}
              onClose={() => setSuccessMessage("")}
            />
          </div>
        )}

        <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12">
          {/* Toolbar */}
          <Toolbar
            title="Lista de Tipos"
            onBackClick={() => navigate("/product-list")}
            onButtonClick={() => openModal("create")}
            buttonText="Nuevo Tipo"
          />

          {/* Filtro */}
          <Filter
            columns={filterColumns}
            initialFilters={filters}
            onFilterChange={handleFilterChange}
          />

          {/* Errores */}
          {(typesError || categoriesError) && (
            <div className="my-4">
              <ErrorMessage
                message={
                  typesError
                    ? typesErrorMsg.message || "Error cargando tipos."
                    : categoriesErrorMsg.message || "Error cargando categorías."
                }
              />
            </div>
          )}

          {/* Spinner */}
          {loadingTypes ? (
            <div className="my-8 flex justify-center items-center min-h-[30vh]">
              <Spinner size="6" color="text-primary-500" />
            </div>
          ) : types.length > 0 ? (
            // Tabla de tipos
            <TypeTable
              types={types}
              getCategoryName={getCategoryName}
              openViewModal={(t) => openModal("view", t)}
              openEditModal={(t) => openModal("edit", t)}
              openDeleteConfirmModal={(t) => openModal("deleteConfirm", t)}
              goToNextPage={
                nextPageUrl ? () => prefetchPage(nextPageUrl) : null
              }
              goToPreviousPage={
                previousPageUrl ? () => prefetchPage(previousPageUrl) : null
              }
              nextPageUrl={nextPageUrl}
              previousPageUrl={previousPageUrl}
            />
          ) : (
            <div className="text-center py-10 px-4 mt-4 bg-white rounded-lg shadow">
              <p className="text-gray-500">No se encontraron tipos.</p>
            </div>
          )}
        </div>
      </Layout>

      {/* Modales de CRUD */}
      <TypeModals
        modalState={modalState}
        closeModal={closeModal}
        onCreateType={handleCreateType}
        onUpdateType={handleUpdateType}
        onDeleteType={handleDeleteType}
        categories={categories}
        loadingCategories={loadingCategories}
        getCategoryName={getCategoryName}
      />
    </>
  )
}

export default TypeList
