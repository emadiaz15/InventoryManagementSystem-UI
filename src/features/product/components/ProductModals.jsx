import React from "react"
import CreateProductModal from "./CreateProductModal"
import EditProductModal from "./EditProductModal"
import ViewProductModal from "./ViewProductModal"
import ProductCarouselOverlay from "./ProductCarouselOverlay"
import DeleteMessage from "@/components/common/DeleteMessage"
import Spinner from "@/components/ui/Spinner"
import { useAuth } from "@/context/AuthProvider"
import {
    useProductFiles,
    useEnrichedProductFiles
} from "@/features/product/hooks/useProductFileHooks"

const ProductModals = ({
    modalState,
    closeModal,
    onCreateProduct,
    onUpdateProduct,
    onDeleteProduct,
    isDeleting,
    deleteError,
    clearDeleteError,
}) => {
    const { user } = useAuth()
    const isStaff = user?.is_staff

    const { type, productData } = modalState
    const productId = productData?.id

    // Hooks para archivos
    const { data: rawFiles = [], isLoading: loadingRaw } = useProductFiles(
        (type === "view" || type === "edit") ? productId : null
    )
    const { files, status: filesStatus } = useEnrichedProductFiles(productId, rawFiles)
    const isLoadingFiles = loadingRaw || filesStatus === "loading"

    if (!type) return null

    return (
        <>
            {type === "create" && isStaff && (
                <CreateProductModal
                    isOpen
                    onClose={closeModal}
                    onSave={onCreateProduct}
                />
            )}

            {type === "edit" && isStaff && productId && (
                <EditProductModal
                    isOpen
                    onClose={closeModal}
                    product={productData}
                    onSave={() => onUpdateProduct(productData)}
                >
                    {isLoadingFiles ? (
                        <Spinner size="8" color="text-primary-500" />
                    ) : files.length > 0 ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            onDeleteRequest={(file) => onDeleteProductFile(productId, file)}
                            editable
                            isEmbedded
                        />
                    ) : (
                        <p className="text-center text-gray-600">No hay archivos multimedia.</p>
                    )}
                </EditProductModal>
            )}

            {type === "view" && productId && (
                <ViewProductModal
                    isOpen
                    onClose={closeModal}
                    product={productData}
                >
                    {isLoadingFiles ? (
                        <Spinner size="8" color="text-primary-500" />
                    ) : files.length > 0 ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            editable={false}
                            isEmbedded
                        />
                    ) : (
                        <p className="text-center text-gray-600">No hay archivos multimedia.</p>
                    )}
                </ViewProductModal>
            )}

            {type === "deleteConfirm" && isStaff && productData && (
                <DeleteMessage
                    isOpen
                    onClose={closeModal}
                    onDelete={() => onDeleteProduct(productData)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="el producto"
                    itemIdentifier={productData.name || "SIN NOMBRE"}
                />
            )}
        </>
    )
}

export default ProductModals
