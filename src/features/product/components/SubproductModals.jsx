import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CreateSubproductModal from "./CreateSubproductModal";
import EditSubproductModal from "./EditSubproductModal";
import ViewSubproductModal from "./ViewSubproductModal";
import DeleteMessage from "../../../components/common/DeleteMessage";
import Spinner from "../../../components/ui/Spinner";
import ProductCarouselOverlay from "./ProductCarouselOverlay";
import { listSubproductFiles } from "../services/listSubproductFiles";

/**
 * Centraliza la lógica de modales para Subproductos.
 */
const SubproductModals = ({
    modalState,
    closeModal,
    onCreateSubproduct,
    onUpdateSubproduct,
    onDeleteSubproduct,
    isDeleting = false,
    deleteError = null,
    clearDeleteError,
    parentProduct = null,
}) => {
    if (!modalState?.type) return null;
    const { type, subproductData } = modalState;
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    const loadFiles = useCallback(async () => {
        if (type !== "view" || !subproductData) return;
        setLoadingFiles(true);
        try {
            const imgs = await listSubproductFiles(parentProduct.id, subproductData.id);
            setFiles(imgs);
        } catch (e) {
            console.error("No se pudieron cargar los archivos:", e);
            setFiles([]);
        } finally {
            setLoadingFiles(false);
        }
    }, [type, subproductData, parentProduct]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return (
        <>
            {type === "create" && parentProduct && (
                <CreateSubproductModal
                    isOpen onClose={closeModal} onSave={onCreateSubproduct} product={parentProduct}
                />
            )}

            {type === "edit" && subproductData && (
                <EditSubproductModal
                    isOpen onClose={closeModal} subproduct={subproductData} onSave={onUpdateSubproduct}
                />
            )}

            {type === "view" && subproductData && (
                <ViewSubproductModal
                    isOpen onClose={closeModal} subproduct={subproductData}
                >
                    {loadingFiles ? (
                        <div className="flex items-center justify-center h-32">
                            <Spinner />
                        </div>
                    ) : files.length > 0 ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={parentProduct.id}
                            onClose={closeModal}
                            editable={false}
                            isEmbedded
                        />
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-600">
                            No hay archivos multimedia.
                        </div>
                    )}
                </ViewSubproductModal>
            )}

            {type === "deleteConfirm" && subproductData && (
                <DeleteMessage
                    isOpen onClose={closeModal}
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
        type: PropTypes.oneOf(["create", "edit", "view", "deleteConfirm"]),
        subproductData: PropTypes.object,
    }),
    closeModal: PropTypes.func.isRequired,
    onCreateSubproduct: PropTypes.func.isRequired,
    onUpdateSubproduct: PropTypes.func.isRequired,
    onDeleteSubproduct: PropTypes.func.isRequired,
    isDeleting: PropTypes.bool,
    deleteError: PropTypes.string,
    clearDeleteError: PropTypes.func.isRequired,
    parentProduct: PropTypes.shape({ id: PropTypes.number }),
};

export default SubproductModals;
