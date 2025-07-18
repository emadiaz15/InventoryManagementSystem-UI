import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "@/context/AuthProvider";

import CreateSubproductModal from "./CreateSubproductModal";
import EditSubproductModal from "./EditSubproductModal";
import ViewSubproductModal from "./ViewSubproductModal";
import CreateCuttingOrderWizard from "@/features/cuttingOrder/components/CreateCuttingOrderWizard";
import DeleteMessage from "@/components/common/DeleteMessage";
import Spinner from "@/components/ui/Spinner";
import ProductCarouselOverlay from "./ProductCarouselOverlay";

import { listSubproductFiles } from "../services/subproducts/subproductsFiles";
import { enrichFilesWithBlobUrls } from "@/services/files/fileAccessService";

const MultimediaWrapper = ({ files, loading, productId, subproductId, onClose }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="8" color="text-primary-500" />
            </div>
        );
    }
    if (files.length > 0) {
        return (
            <ProductCarouselOverlay
                images={files}
                productId={productId}
                subproductId={subproductId}
                onClose={onClose}
                editable={false}
                isEmbedded
            />
        );
    }
    return (
        <div className="p-4 text-center text-sm text-gray-600">
            No hay archivos multimedia.
        </div>
    );
};

MultimediaWrapper.propTypes = {
    files: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    productId: PropTypes.number.isRequired,
    subproductId: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

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
    const { user } = useAuth();
    const isStaff = user?.is_staff;

    const { type, subproductData } = modalState || {};
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    const handleCreateSuccess = () => {
        closeModal();
        onCreateSubproduct();
    };

    const loadFiles = useCallback(async () => {
        if (!parentProduct?.id || !subproductData?.id) return;
        setLoadingFiles(true);
        try {
            const rawFiles = await listSubproductFiles(parentProduct.id, subproductData.id);
            const enriched = await enrichFilesWithBlobUrls({
                productId: parentProduct.id,
                subproductId: subproductData.id,
                rawFiles,
            });
            setFiles(enriched);
        } catch (err) {
            console.error("❌ No se pudieron cargar los archivos:", err);
            setFiles([]);
        } finally {
            setLoadingFiles(false);
        }
    }, [parentProduct, subproductData]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    if (!type) return null;

    return (
        <>
            {type === "create" && parentProduct && isStaff && (
                <CreateSubproductModal
                    isOpen
                    onClose={closeModal}
                    onSave={handleCreateSuccess}
                    product={parentProduct}
                />
            )}

            {type === "edit" && subproductData && isStaff && (
                <EditSubproductModal
                    isOpen
                    onClose={closeModal}
                    subproduct={subproductData}
                    onSave={onUpdateSubproduct}
                    onDeleteSuccess={loadFiles}
                >
                    <MultimediaWrapper
                        files={files}
                        loading={loadingFiles}
                        productId={parentProduct.id}
                        subproductId={subproductData.id}
                        onClose={closeModal}
                    />
                </EditSubproductModal>
            )}

            {type === "view" && subproductData && (
                <ViewSubproductModal
                    isOpen
                    onClose={closeModal}
                    subproduct={subproductData}
                    mediaPanel={
                        <MultimediaWrapper
                            files={files}
                            loading={loadingFiles}
                            productId={parentProduct.id}
                            subproductId={subproductData.id}
                            onClose={closeModal}
                        />
                    }
                />
            )}

            {type === "createOrder" && isStaff && subproductData && (
                <CreateCuttingOrderWizard
                    isOpen
                    productId={parentProduct.id}
                    subproductId={subproductData.id}
                    onClose={closeModal}
                    onCreateOrder={() => onCreateOrder(subproductData)}
                />
            )}

            {type === "deleteConfirm" && subproductData && isStaff && (
                <DeleteMessage
                    isOpen
                    onClose={closeModal}
                    onDelete={() => onDeleteSubproduct(subproductData)}
                    isDeleting={isDeleting}
                    deleteError={deleteError}
                    clearDeleteError={clearDeleteError}
                    itemName="el subproducto"
                    itemIdentifier={subproductData.brand || subproductData.id}
                />
            )}
        </>
    );
};

SubproductModals.propTypes = {
    modalState: PropTypes.shape({
        type: PropTypes.oneOf(["create", "edit", "view", "createOrder", "deleteConfirm"]),
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
    parentProduct: PropTypes.shape({ id: PropTypes.number }),
};

export default SubproductModals;
