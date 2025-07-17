import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";
import { useProductFileList, useEnrichedProductFiles } from "@/features/product/hooks/useProductFileHooks";
import ProductCarouselOverlay from "../components/ProductCarouselOverlay";
import { formatArgentineDate } from "@/utils/dateUtils";

const ViewProductModal = ({ product, isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const { data: rawFiles = [], isLoading: loadingRaw } = useProductFileList(
        isOpen ? product?.id : null
    );

    useEffect(() => {
        if (!isOpen || !product?.id) return;

        const fetchData = async () => {
            try {
                const [catResp, typeResp] = await Promise.all([
                    listCategories("/inventory/categories/?limit=1000&status=true"),
                    listTypes("/inventory/types/?limit=1000&status=true"),
                ]);
                setCategories(catResp.results || []);
                setTypes(typeResp.results || []);
            } catch (err) {
                console.error("Error cargando datos del producto:", err);
            }
        };

        fetchData();
    }, [isOpen, product?.id]);

    const { files, loading } = useEnrichedProductFiles(product?.id, rawFiles);
    const isLoading = loading || loadingRaw;

    if (!product) return null;

    const categoryName = product.category_name || "Sin categoría";
    const typeName = product.type_name || "Sin tipo";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Producto"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col md:flex-row gap-4 h-full text-text-primary">
                <div className="flex-1 space-y-2 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    <p><span className="font-semibold">ID:</span> {product.id}</p>
                    <p><span className="font-semibold">Código:</span> {product.code || "N/A"}</p>
                    <p><span className="font-semibold">Tipo:</span> {typeName}</p>
                    <p><span className="font-semibold">Nombre/Medida:</span> {product.name || "SIN NOMBRE"}</p>
                    <p><span className="font-semibold">Descripción:</span> {product.description || "SIN DESCRIPCIÓN"}</p>
                    <p><span className="font-semibold">Categoría:</span> {categoryName}</p>
                    <p><span className="font-semibold">Estado:</span> {product.status ? "Activo" : "Inactivo"}</p>
                    <p><span className="font-semibold">Tiene subproductos? (Cables):</span> {product.has_subproducts ? "Sí" : "No"}</p>
                    <p><span className="font-semibold">Stock actual:</span> {product.current_stock ?? 0}</p>
                    <p><span className="font-semibold">Marca:</span> {product.brand || "N/A"}</p>
                    <p><span className="font-semibold">Ubicación:</span> {product.location || "N/A"}</p>
                    <p><span className="font-semibold">Posición:</span> {product.position || "N/A"}</p>
                    <p><span className="font-semibold">Creado en:</span> {formatArgentineDate(product.created_at)}</p>
                    <p><span className="font-semibold">Modificado en:</span> {formatArgentineDate(product.modified_at)}</p>
                    <p><span className="font-semibold">Creado por:</span> {product.created_by || "N/A"}</p>
                    <p><span className="font-semibold">Modificado por:</span> {product.modified_by || "N/A"}</p>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
                <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">Cargando archivos...</div>
                    ) : (
                        <ProductCarouselOverlay images={files} productId={product.id} isEmbedded />
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ViewProductModal;
