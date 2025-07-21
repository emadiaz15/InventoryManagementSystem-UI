// src/features/type/components/TypeTable.jsx
import React, { useMemo } from "react"
import Table from "@/components/common/Table"
import Pagination from "@/components/ui/Pagination"
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"

const TypeTable = ({
    types,
    getCategoryName,
    openViewModal,
    openEditModal,
    openDeleteConfirmModal,
    goToNextPage,
    goToPreviousPage,
    nextPageUrl,
    previousPageUrl
}) => {
    const rows = useMemo(
        () =>
            types.map((t) => ({
                Tipo: t.name,
                Descripción: t.description || "Sin descripción",
                Categoría: getCategoryName(t.category),
                Acciones: (
                    <div className="flex space-x-2">
                        <button onClick={() => openViewModal(t)} className="bg-blue-500 p-2 rounded hover:bg-blue-600">
                            <EyeIcon className="w-5 h-5 text-white" />
                        </button>
                        <button onClick={() => openEditModal(t)} className="bg-primary-500 p-2 rounded hover:bg-primary-600">
                            <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                        <button onClick={() => openDeleteConfirmModal(t)} className="bg-red-500 p-2 rounded hover:bg-red-600">
                            <TrashIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                )
            })),
        [types, getCategoryName, openViewModal, openEditModal, openDeleteConfirmModal]
    )

    const headers = useMemo(() => ["Tipo", "Descripción", "Categoría", "Acciones"], [])

    return (
        <>
            <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
                <Table headers={headers} rows={rows} />
            </div>
            <div className="mt-4">
                <Pagination
                    onNext={goToNextPage}
                    onPrevious={goToPreviousPage}
                    hasNext={!!nextPageUrl}
                    hasPrevious={!!previousPageUrl}
                />
            </div>
        </>
    )
}

export default TypeTable
