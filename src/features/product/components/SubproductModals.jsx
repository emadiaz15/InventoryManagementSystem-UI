// src/features/product/components/SubproductModals.jsx
import React from "react"
import PropTypes from "prop-types"
import { useAuth } from "@/context/AuthProvider"

import CreateSubproductModal from "./CreateSubproductModal"
import EditSubproductModal from "./EditSubproductModal"
import ViewSubproductModal from "./ViewSubproductModal"
import CreateCuttingOrderWizard from "@/features/cuttingOrder/components/CreateCuttingOrderWizard"
import DeleteMessage from "@/components/common/DeleteMessage"
import Spinner from "@/components/ui/Spinner"
import ProductCarouselOverlay from "./ProductCarouselOverlay"

import { useSubproductFilesData } from "@/features/product/hooks/useSubproductFileHooks"

const SubproductModals = ({
    modalState,
    closeModal,
    onCreateSubproduct,
    onUpdateSubproduct,
    onDeleteSubproduct,
    onCreateOrder,
    isDeleting = false,
    deleteError = null,
    clearDeleteError,
    parentProduct,
}) => {
    const { user } = useAuth()
    const isStaff = user?.is_staff

    const { type, subproductData } = modalState || {}
    const productId = parentProduct?.id
    const subproductId = subproductData?.id

    // 🔄 raw + enriched files
    const {
        files = [],
        isLoading: isLoadingFiles,
    } = useSubproductFilesData(
        type && subproductId ? productId : null,
        type && subproductId ? subproductId : null
    )

    if (!type) return null

    return (
        <>
            {type === "create" && productId && isStaff && (
                <CreateSubproductModal
                    isOpen
                    onClose={closeModal}
                    onSave={onCreateSubproduct}
                    product={parentProduct}
                />
            )}

            {type === "edit" && subproductData && isStaff && (
                <EditSubproductModal
                    isOpen
                    onClose={closeModal}
                    subproduct={subproductData}
                    onSave={(updated) => onUpdateSubproduct(parentProduct.id, updated)}
                >
                    {isLoadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : files.length > 0 ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            subproductId={subproductId}
                            editable
                            isEmbedded
                        />
                    ) : (
                        <p className="p-4 text-center text-sm text-gray-600">
                            No hay archivos multimedia.
                        </p>
                    )}
                </EditSubproductModal>
            )}

            {type === "view" && subproductData && (
                <ViewSubproductModal
                    isOpen
                    onClose={closeModal}
                    subproduct={subproductData}
                    mediaPanel={
                        isLoadingFiles ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner size="8" color="text-primary-500" />
                            </div>
                        ) : files.length > 0 ? (
                            <ProductCarouselOverlay
                                images={files}
                                productId={productId}
                                subproductId={subproductId}
                                editable={false}
                                isEmbedded
                            />
                        ) : (
                            <p className="p-4 text-center text-sm text-gray-600">
                                No hay archivos multimedia.
                            </p>
                        )
                    }
                />
            )}

            {type === "createOrder" && isStaff && subproductData && (
                <CreateCuttingOrderWizard
                    isOpen
                    productId={productId}
                    subproductId={subproductId}
                    onClose={closeModal}
                    onCreateOrder={() => onCreateOrder(subproductData)}
                />
            )}

            {type === "deleteConfirm" && subproductData && isStaff && (
                <DeleteMessage
                    isOpen
                    onClose={closeModal}
                    onDelete={() => onDeleteSubproduct(subproductData.id)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="el subproducto"
                    itemIdentifier={subproductData.brand || subproductData.id}
                />
            )}
        </>
    )
}

SubproductModals.propTypes = {
    modalState: PropTypes.shape({
        type: PropTypes.oneOf([
            "create",
            "edit",
            "view",
            "createOrder",
            "deleteConfirm",
        ]),
        subproductData: PropTypes.object,
    }),
    closeModal: PropTypes.func.isRequired,
    onCreateSubproduct: PropTypes.func.isRequired,
    onUpdateSubproduct: PropTypes.func.isRequired,
    onDeleteSubproduct: PropTypes.func.isRequired,
    onCreateOrder: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool,
    deleteError: PropTypes.string,
    clearDeleteError: PropTypes.func.isRequired,
    parentProduct: PropTypes.shape({ id: PropTypes.number }).isRequired,
}

export default SubproductModals
