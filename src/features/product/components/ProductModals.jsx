import React, { useState, useEffect, useCallback } from "react";
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";
import ViewProductModal from "./ViewProductModal";
import ProductCarouselOverlay from "./ProductCarouselOverlay";
import DeleteMessage from "../../../components/common/DeleteMessage";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../../../context/AuthProvider";

import { listProductFiles } from "../services/listProductFiles";
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

    const loadFiles = useCallback(async () => {
        if (!productId || !["view", "edit"].includes(type)) return;

        setLoadingFiles(true);
        try {
            const rawFiles = await listProductFiles(productId);
            console.log("📦 Archivos obtenidos del backend:", rawFiles);

            const enriched = await enrichFilesWithBlobUrls({ productId, rawFiles });
            setFiles(enriched);
        } catch (err) {
            console.error("❌ No se pudieron cargar archivos del producto:", err);
            setFiles([]);
        } finally {
            setLoadingFiles(false);
        }
    }, [type, productId]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

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
                    onDeleteSuccess={loadFiles}
                >
                    {loadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : hasFiles ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            onClose={closeModal}
                            onDeleteSuccess={loadFiles}
                            editable={true}
                            isEmbedded
                        />
                    ) : (
                        <div className="p-6 text-center text-sm text-gray-600">
                            No hay archivos de multimedia.
                        </div>
                    )}
                </EditProductModal>
            )}

            {type === "view" && productData && (
                <ViewProductModal
                    isOpen={true}
                    onClose={closeModal}
                    product={productData}
                >
                    {loadingFiles ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner size="8" color="text-primary-500" />
                        </div>
                    ) : hasFiles ? (
                        <ProductCarouselOverlay
                            images={files}
                            productId={productId}
                            onClose={closeModal}
                            onDeleteSuccess={loadFiles}
                            editable={false}
                            isEmbedded
                        />
                    ) : (
                        <div className="p-6 text-center text-sm text-gray-600">
                            No hay archivos de multimedia.
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
