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
import { useAuth } from "../../../context/AuthProvider";

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
    const { user } = useAuth();
    const isStaff = user?.is_staff;

    const handleViewHistory = (product) => {
        navigate(`/products/${product.id}/history`);
    };

    const headers = ["Código", "Artículo", "Stock", "Marca", "Categoría", "Acciones"];

    const rows = products.map((product) => ({
        "Código": (
            <div className="w-[90px] truncate">{product.code || "N/A"}</div>
        ),
        "Artículo": (
            <div className="min-w-[300px] max-w-[400px] truncate">
                {product.type_name ? `${product.type_name} - ${product.name || "Sin nombre"}` : (product.name || "Sin nombre")}
            </div>
        ),
        "Stock": (
            <div className="w-[80px] truncate">{product.current_stock ?? 0}</div>
        ),
        "Marca": (
            <div className="w-[100px] truncate">{product.brand || "Sin marca"}</div>
        ),
        "Categoría": (
            <div className="w-[100px] truncate">
                {product.category_name || "Sin categoría"}
            </div>
        ),
        "Acciones": (
            <div className="flex space-x-2 min-w-[200px]">
                {/* Íconos visibles para TODOS */}
                <button
                    onClick={() => onView(product)}
                    className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                    aria-label="Ver detalles"
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>

                {product?.has_subproducts && (
                    <button
                        onClick={() => onShowSubproducts(product)}
                        className="bg-indigo-500 p-2 rounded hover:bg-indigo-600 transition-colors"
                        aria-label="Ver subproductos"
                    >
                        <FolderIcon className="w-5 h-5 text-white" />
                    </button>
                )}

                <button
                    onClick={() => handleViewHistory(product)}
                    className="bg-yellow-500 p-2 rounded hover:bg-yellow-600 transition-colors"
                    aria-label="Ver historial de stock"
                >
                    <ClockIcon className="w-5 h-5 text-white" />
                </button>

                {/* Íconos solo para admins */}
                {isStaff && (
                    <>
                        <button
                            onClick={() => onEdit(product)}
                            className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                            aria-label="Editar producto"
                        >
                            <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() =>
                                onDelete({ type: "deleteConfirm", productData: product })
                            }
                            className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                            aria-label="Eliminar producto"
                        >
                            <TrashIcon className="w-5 h-5 text-white" />
                        </button>
                    </>
                )}
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
