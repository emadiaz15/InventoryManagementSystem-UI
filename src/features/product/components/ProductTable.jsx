// src/features/product/components/ProductTable.jsx
import React, { useMemo } from "react"
import Table from "../../../components/common/Table"
import {
    PencilIcon,
    EyeIcon,
    TrashIcon,
    FolderIcon,
    ClockIcon,
} from "@heroicons/react/24/outline"
import { useAuth } from "../../../context/AuthProvider"

const ProductTable = ({
    products = [],
    onView,
    onEdit,
    onDelete,
    onShowSubproducts,
    onViewHistory,
}) => {
    const { user } = useAuth()
    const isStaff = user?.is_staff

    // Definimos los encabezados una sola vez
    const tableHeaders = useMemo(
        () => ["Código", "Artículo", "Stock", "Marca", "Categoría", "Acciones"],
        []
    )

    // Generamos las filas solo cuando cambian products o permisos
    const tableRows = useMemo(
        () =>
            products.map((p) => ({
                Código: (
                    <div className="w-[90px] truncate">{p.code ?? "N/A"}</div>
                ),
                Artículo: (
                    <div className="min-w-[300px] max-w-[400px] truncate">
                        {p.type_name
                            ? `${p.type_name} – ${p.name ?? "Sin nombre"}`
                            : p.name ?? "Sin nombre"}
                    </div>
                ),
                Stock: (
                    <div className="w-[80px] truncate">
                        {p.current_stock ?? 0}
                    </div>
                ),
                Marcas: (
                    <div className="w-[100px] truncate">
                        {p.brand ?? ""}
                    </div>
                ),
                Categoría: (
                    <div className="w-[100px] truncate">
                        {p.category_name ?? ""}
                    </div>
                ),
                Acciones: (
                    <div className="flex space-x-2 min-w-[200px]">
                        {/* Ver detalles */}
                        <button
                            onClick={() => onView(p)}
                            className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                            aria-label="Ver detalles"
                        >
                            <EyeIcon className="w-5 h-5 text-white" />
                        </button>

                        {/* Ver subproductos */}
                        {p.has_subproducts && (
                            <button
                                onClick={() => onShowSubproducts(p)}
                                className="bg-indigo-500 p-2 rounded hover:bg-indigo-600 transition-colors"
                                aria-label="Ver subproductos"
                            >
                                <FolderIcon className="w-5 h-5 text-white" />
                            </button>
                        )}

                        {/* Historial de stock */}
                        <button
                            onClick={() => onViewHistory(p)}
                            className="bg-yellow-500 p-2 rounded hover:bg-yellow-600 transition-colors"
                            aria-label="Ver historial de stock"
                        >
                            <ClockIcon className="w-5 h-5 text-white" />
                        </button>

                        {/* Edición / Eliminación (solo staff) */}
                        {isStaff && (
                            <>
                                <button
                                    onClick={() => onEdit(p)}
                                    className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                                    aria-label="Editar producto"
                                >
                                    <PencilIcon className="w-5 h-5 text-white" />
                                </button>
                                <button
                                    onClick={() => onDelete(p)}
                                    className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                                    aria-label="Eliminar producto"
                                >
                                    <TrashIcon className="w-5 h-5 text-white" />
                                </button>
                            </>
                        )}
                    </div>
                ),
            })),
        [
            products,
            isStaff,
            onView,
            onEdit,
            onDelete,
            onShowSubproducts,
            onViewHistory,
        ]
    )

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table headers={tableHeaders} rows={tableRows} />
        </div>
    )
}

export default ProductTable
