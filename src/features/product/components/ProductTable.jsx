import React from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/common/Table";
import {
    PencilIcon,
    EyeIcon,
    TrashIcon,
    FolderIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";

/**
 * Tabla de productos con acciones: ver, editar, eliminar, ver subproductos e historial.
 * Al hacer clic en el icono de reloj, navega a /products/:productId/history.
 */
const ProductTable = ({
    products,
    onView,
    onEdit,
    onDelete,
    onShowSubproducts,
    getTypeName,
    getCategoryName,
}) => {
    const navigate = useNavigate();

    const handleViewHistory = (product) => {
        navigate(`/products/${product.id}/history`);
    };

    const headers = ["Código", "Articulo", "Stock", "Marcas", "Categoría", "Acciones"];

    const rows = products.map((product) => ({
        "Código": (
            <div className="w-[90px] truncate">{product.code || "N/A"}</div>
        ),
        "Articulo": (
            <div className="min-w-[300px] max-w-[400px] truncate">
                {`${getTypeName?.(product.type) ?? "Sin tipo"} - ${product.name || "Sin nombre"}`}
            </div>
        ),
        "Stock": (
            <div className="w-[80px] truncate">{product.current_stock ?? 0}</div>
        ),
        "Marcas": (
            <div className="w-[100px] truncate">{product.brand || "Sin marca"}</div>
        ),
        "Categoría": (
            <div className="w-[100px] truncate">{getCategoryName?.(product.category) ?? "Sin categoría"}</div>
        ),
        "Acciones": (
            <div className="flex space-x-2 min-w-[180px]">
                <button
                    onClick={() => onView(product)}
                    className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                    aria-label="Ver detalles"
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={() => onShowSubproducts(product)}
                    className="bg-indigo-500 p-2 rounded hover:bg-indigo-600 transition-colors"
                    aria-label="Ver subproductos"
                >
                    <FolderIcon className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={() => onEdit(product)}
                    className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                    aria-label="Editar producto"
                >
                    <PencilIcon className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={() => handleViewHistory(product)}
                    className="bg-yellow-500 p-2 rounded hover:bg-yellow-600 transition-colors"
                    aria-label="Ver historial de stock"
                >
                    <ClockIcon className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={() => onDelete({ type: "deleteConfirm", productData: product })}
                    className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                    aria-label="Eliminar producto"
                >
                    <TrashIcon className="w-5 h-5 text-white" />
                </button>
            </div>
        ),
    }));

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table headers={headers} rows={rows} />
        </div>
    );
};

export default ProductTable;
