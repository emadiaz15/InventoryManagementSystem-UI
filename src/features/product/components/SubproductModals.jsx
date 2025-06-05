import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthProvider";

import CreateSubproductModal from "./CreateSubproductModal";
import EditSubproductModal from "./EditSubproductModal";
import ViewSubproductModal from "./ViewSubproductModal";
import CreateCuttingOrderWizard from "../../cuttingOrder/components/CreateCuttingOrderWizard";
import DeleteMessage from "../../../components/common/DeleteMessage";
import Spinner from "../../../components/ui/Spinner";
import ProductCarouselOverlay from "./ProductCarouselOverlay";
import { djangoApi } from "@/services/clients";
import { fetchProtectedFile } from "@/services/mediaService";

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

/**
 * Centraliza la lógica de modales para Subproductos.
 */
const SubproductModals = ({
    modalState,
    closeModal,
    onCreateSubproduct,
    onUpdateSubproduct,
    onDeleteSubproduct,
    onCreateOrder,          // ← Nueva prop
    isDeleting = false,
    deleteError = null,
    clearDeleteError,
    parentProduct = null,
}) => {
    if (!modalState?.type) return null;

    const { user } = useAuth();
    const isStaff = user?.is_staff;

    const { type, subproductData } = modalState;
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    const handleCreateSuccess = () => {
        closeModal(); // desmonta el modal antes de refrescar
        onCreateSubproduct();
    };

    const loadFiles = useCallback(async () => {
        if (!subproductData || !parentProduct?.id) return;
        setLoadingFiles(true);
        try {
            const res = await djangoApi.get(
                `/inventory/products/${parentProduct.id}/subproducts/${subproductData.id}/files/`
            );
            const fetched = await Promise.all(
                (res.data.files || []).map(async (f) => {
                    const url = await fetchProtectedFile(
                        parentProduct.id,
                        f.drive_file_id,
                        "django",
                        subproductData.id
                    );
                    const contentType =
                        f.contentType || f.content_type || f.mimeType || "application/octet-stream";
                    return {
                        id: f.drive_file_id,
                        filename: f.filename || f.drive_file_id,
                        contentType,
                        url,
                    };
                })
            );
            setFiles(fetched);
        } catch (e) {
            console.error("❌ No se pudieron cargar los archivos:", e);
            setFiles([]);
        } finally {
            setLoadingFiles(false);
        }
    }, [subproductData, parentProduct]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    return (
        <>
            {/* Crear Subproducto */}
            {type === "create" && parentProduct && (
                <CreateSubproductModal
                    isOpen
                    onClose={closeModal}
                    onSave={handleCreateSuccess}
                    product={parentProduct}
                />
            )}

            {/* Editar Subproducto */}
            {type === "edit" && subproductData && (
                <EditSubproductModal
                    isOpen
                    onClose={closeModal}
                    subproduct={subproductData}
                    onSave={onUpdateSubproduct}
                    onDeleteSuccess={loadFiles}
                >
                    {loadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : files.length > 0 ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={parentProduct.id}
                            subproductId={subproductData.id}
                            onClose={closeModal}
                            onDeleteSuccess={loadFiles}
                            editable
                            isEmbedded
                            source="django"
                        />
                    ) : (
                        <div className="p-6 text-center text-sm text-gray-600">
                            No hay archivos de multimedia.
                        </div>
                    )}
                </EditSubproductModal>
            )}

            {/* Ver Subproducto */}
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

            {/* Crear Orden de Corte (botón tijera) */}
            {type === "createOrder" && isStaff && subproductData && (
                <CreateCuttingOrderWizard
                    isOpen
                    productId={modalState.productId}
                    onClose={closeModal}
                />
            )}

            {/* Confirmación de eliminación */}
            {type === "deleteConfirm" && subproductData && (
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
        type: PropTypes.oneOf([
            "create",
            "edit",
            "view",
            "createOrder",    // ← Añadido
            "deleteConfirm"
        ]),
        subproductData: PropTypes.object,
    }),
    closeModal: PropTypes.func.isRequired,
    onCreateSubproduct: PropTypes.func.isRequired,
    onUpdateSubproduct: PropTypes.func.isRequired,
    onDeleteSubproduct: PropTypes.func.isRequired,
    onCreateOrder: PropTypes.func.isRequired,    // ← Nueva
    isDeleting: PropTypes.bool,
    deleteError: PropTypes.string,
    clearDeleteError: PropTypes.func.isRequired,
    parentProduct: PropTypes.shape({ id: PropTypes.number }),
};

export default SubproductModals;
