// src/features/product/components/ViewProductModal.jsx
import React from "react"
import Modal from "@/components/ui/Modal"
import { usePrefetchedData } from "@/context/DataPrefetchContext"
import {
    useProductFiles,
    useEnrichedProductFiles,
} from "@/features/product/hooks/useProductFileHooks"
import ProductCarouselOverlay from "../components/ProductCarouselOverlay"
import { formatArgentineDate } from "@/utils/dateUtils"
import Spinner from "@/components/ui/Spinner"

const ViewProductModal = ({ product, isOpen, onClose }) => {
    // 1️⃣ Determinar productId (null si está cerrado)
    const productId = isOpen ? product?.id : null

    // 2️⃣ HOOKS TOP-LEVEL, SIEMPRE en el mismo orden
    const { categories, types } = usePrefetchedData()
    const {
        data: rawFiles = [],
        isLoading: loadingRaw,
        error: rawError,
    } = useProductFiles(productId)
    const {
        files,
        status: downloadStatus,
        error: downloadError,
    } = useEnrichedProductFiles(productId)

    const loadingFiles = loadingRaw || downloadStatus === "loading"
    const filesError = rawError || downloadError

    // 3️⃣ Early return SOLO para el caso de no haber producto
    if (!product) return null

    // 4️⃣ Nombre legible de categoría y tipo
    const categoryName =
        categories.find((c) => c.id === product.category)?.name ||
        product.category_name ||
        "Sin categoría"

    const typeName =
        types.find((t) => t.id === product.type)?.name ||
        product.type_name ||
        "Sin tipo"

    // 5️⃣ Renderizado
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
                    <p><strong>Código:</strong> {product.code || "N/A"}</p>
                    <p><strong>Categoría:</strong> {categoryName}</p>
                    <p><strong>Tipo:</strong> {typeName}</p>
                    <p><strong>Nombre/Medida:</strong> {product.name || "SIN NOMBRE"}</p>
                    <p><strong>Descripción:</strong> {product.description || "SIN DESCRIPCIÓN"}</p>
                    <p><strong>Estado:</strong> {product.status ? "Activo" : "Inactivo"}</p>
                    <p><strong>Subproductos?</strong> {product.has_subproducts ? "Sí" : "No"}</p>
                    <p><strong>Stock actual:</strong> {product.current_stock ?? 0}</p>
                    <p><strong>Marca:</strong> {product.brand || "N/A"}</p>
                    <p><strong>Ubicación:</strong> {product.location || "N/A"}</p>
                    <p><strong>Posición:</strong> {product.position || "N/A"}</p>
                    <p><strong>Creado en:</strong> {formatArgentineDate(product.created_at)}</p>
                    <p><strong>Modificado en:</strong> {formatArgentineDate(product.modified_at)}</p>
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
                    ) : (
                        <ProductCarouselOverlay
                            images={files}
                            productId={product.id}
                            isEmbedded
                        />
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default ViewProductModal
