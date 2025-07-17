import React, { useState, useEffect, useRef } from "react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import ViewProductModal from "./ViewProductModal";
import ProductCarouselOverlay from "./ProductCarouselOverlay";
import DeleteMessage from "../../../components/common/DeleteMessage";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../../../context/AuthProvider";

import { useProductFileList } from "@/features/product/hooks/useProductFileHooks";
import { enrichFilesWithBlobUrls } from "@/services/files/fileAccessService";

/**
 * Componente central de todos los modales asociados a producto.
 */
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
    const [files, setFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const { user } = useAuth();
    const isStaff = user?.is_staff;
    const { type = "", productData = {}, showCarousel = false } = modalState || {};
    const productId = productData?.id;
    const { data: rawFiles = [], isLoading: loadingRaw } = useProductFileList(
        productId && ["view", "edit"].includes(type) ? productId : null
    );
    const prevRawIds = useRef("init");

    useEffect(() => {
        if (!productId || !["view", "edit"].includes(type)) return;
        const ids = Array.isArray(rawFiles)
            ? rawFiles.map((f) => f.id || f.drive_file_id || f.key).join(",")
            : "";
        if (prevRawIds.current === ids) return;
        prevRawIds.current = ids;

        let ignore = false;
        const controller = new AbortController();
        setLoadingFiles(true);

        enrichFilesWithBlobUrls({ productId, rawFiles, signal: controller.signal })
            .then((enriched) => {
                if (!ignore) setFiles(enriched);
            })
            .catch((err) => {
                console.error("❌ No se pudieron cargar archivos del producto:", err);
                if (!ignore) setFiles([]);
            })
            .finally(() => {
                if (!ignore) setLoadingFiles(false);
            });

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [productId, type, rawFiles]);

    const isLoadingFiles = loadingRaw || loadingFiles;

    if (!type) return null;

    const hasFiles = Array.isArray(files) && files.length > 0;

    return (
        <>
            {type === "create" && isStaff && (
                <CreateProductModal
                    isOpen={true}
                    onClose={closeModal}
                    onSave={onCreateProduct}
                />
            )}

            {type === "edit" && isStaff && productData && (
                <EditProductModal
                    isOpen={true}
                    onClose={closeModal}
                    product={productData}
                    onSave={onUpdateProduct}
                >
                    {isLoadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : hasFiles ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            onClose={closeModal}
                            editable={true}
                            isEmbedded
                        />
                    ) : (
                        <div className="p-6 text-center text-sm text-gray-600">
                            No hay archivos multimedia.
                        </div>
                    )}
                </EditProductModal>
            )}

            {type === "view" && productData && (
                <ViewProductModal isOpen={true} onClose={closeModal} product={productData}>
                    {isLoadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : hasFiles ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            onClose={closeModal}
                            editable={false}
                            isEmbedded
                        />
                    ) : (
                        <div className="p-6 text-center text-sm text-gray-600">
                            No hay archivos multimedia.
                        </div>
                    )}
                </ViewProductModal>
            )}

            {type === "deleteConfirm" && isStaff && productData && (
                <DeleteMessage
                    isOpen={true}
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
    );
};

export default ProductModals;
