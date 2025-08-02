// src/features/product/components/ViewProductModal.jsx
import React, { useEffect } from "react"
import PropTypes from "prop-types"

import Modal from "@/components/ui/Modal"
import { usePrefetchedData } from "@/context/DataPrefetchContext"
import { useProductFilesData } from "@/features/product/hooks/useProductFileHooks"
import ProductCarouselOverlay from "@/features/product/components/ProductCarouselOverlay"
import { formatArgentineDate } from "@/utils/dateUtils"
import Spinner from "@/components/ui/Spinner"
import { useQueryClient } from "@tanstack/react-query"
import { productKeys } from "@/features/product/utils/queryKeys"

const ViewProductModal = ({ product, isOpen, onClose }) => {
    const { categories, types } = usePrefetchedData()
    const productId = isOpen ? product?.id : null
    const qc = useQueryClient()

    // 🔄 Forzar refetch al abrir
    useEffect(() => {
        if (isOpen && productId) {
            qc.invalidateQueries(productKeys.files(productId))
        }
    }, [isOpen, productId, qc])

    const {
        files = [],
        isLoading: loadingFiles,
        error: filesError,
    } = useProductFilesData(productId)

    if (!product) return null

    const categoryName =
        categories.find((c) => c.id === product.category)?.name ||
        product.category_name ||
        "N/A"

    const typeName =
        types.find((t) => t.id === product.type)?.name ||
        product.type_name ||
        ""

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Producto"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col md:flex-row gap-4 h-full text-text-primary">
                {/* — Detalles */}
                <div className="flex-1 space-y-2 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Código:</strong> {product.code ?? "N/A"}</p>
                    <p><strong>Categoría:</strong> {categoryName}</p>
                    <p><strong>Nombre/Medida:</strong> {typeName} {product.name || "SIN NOMBRE"}</p>
                    <p><strong>Descripción:</strong> {product.description || "SIN DESCRIPCIÓN"}</p>
                    <p><strong>Stock actual:</strong> {product.current_stock ?? 0}</p>
                    <p><strong>Marca:</strong> {product.brand || "N/A"}</p>
                    <p><strong>Ubicación:</strong> {product.location || "N/A"}</p>
                    <p><strong>Posición:</strong> {product.position || "N/A"}</p>
                    <p><strong>Creado en:</strong> {formatArgentineDate(product.created_at)}</p>
                    <p><strong>Última Modificación:</strong> {formatArgentineDate(product.modified_at)}</p>
                    <p><strong>Creado por:</strong> {product.created_by || "N/A"}</p>
                    <p><strong>Modificado por:</strong> {product.modified_by || "N/A"}</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* — Carousel */}
                <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                    {loadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : filesError ? (
                        <p className="text-red-500">Error cargando archivos.</p>
                    ) : files.length > 0 ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={product.id}
                            isEmbedded
                        />
                    ) : (
                        <p className="text-center text-gray-600">
                            No hay archivos multimedia.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    )
}

ViewProductModal.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        category: PropTypes.number,
        category_name: PropTypes.string,
        type: PropTypes.number,
        type_name: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
        status: PropTypes.bool,
        has_subproducts: PropTypes.bool,
        current_stock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        brand: PropTypes.string,
        location: PropTypes.string,
        position: PropTypes.string,
        created_at: PropTypes.string,
        modified_at: PropTypes.string,
        created_by: PropTypes.string,
        modified_by: PropTypes.string,
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ViewProductModal
