import React from "react";
import {
    PencilIcon,
    TrashIcon,
    EyeIcon,
    ClockIcon,
    ScissorsIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import ProductCarouselOverlay from "@/features/product/components/ProductCarouselOverlay";

const getDefaultImage = (subType) => {
    const typeNormalized = (subType || "").toLowerCase();
    if (typeNormalized === "rollo") return "/rollo.png";
    if (typeNormalized === "bobina") return "/bobina.png";
    return "/default.png";
};

const SubproductCard = ({
    subproduct,
    onAddToOrder,
    onEdit,
    onDelete,
    onViewDetails,
}) => {
    const imageUrl = subproduct.technical_sheet_photo
        ? subproduct.technical_sheet_photo
        : getDefaultImage(subproduct.form_type);

    const { user } = useAuth();
    const isStaff = user?.is_staff;
    const navigate = useNavigate();

    const handleViewStockHistory = () => {
        if (subproduct?.id) {
            navigate(`/subproducts/${subproduct.id}/stock-history`);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 w-full max-w-xs text-sm">
            {/* Header */}
            <div className="flex justify-between px-2 py-1 border-b">
                <span className="text-sm font-semibold truncate">
                    {subproduct.parent_type_name} - {subproduct.parent_name}
                </span>
                <li className="flex items-center">
                    <span
                        className={`inline-block w-3 h-3 mr-2 rounded-full ${subproduct.status ? "bg-green-500" : "bg-red-500"
                            }`}
                    />
                    {subproduct.status ? "Disponible" : "Terminada"}
                </li>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row p-2 space-y-2 md:space-y-0 md:space-x-2">
                <img
                    className="object-cover w-full h-24 md:w-24 md:h-24 rounded"
                    src={imageUrl}
                    alt={subproduct.name}
                />
                <ul className="flex-1 text-sm text-gray-700 space-y-1 overflow-hidden">
                    <li>
                        <strong>Marca:</strong> {subproduct.brand}
                    </li>
                    <li>
                        <strong>N°:</strong> {subproduct.number_coil}
                    </li>
                    <li className="pl-14 text-2xl text-black">
                        {subproduct.initial_stock_quantity} Mts
                    </li>
                </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center items-center space-x-2 p-4 border-t">
                {/* 👁️ Ficha Técnica */}
                <button
                    onClick={onViewDetails}
                    title="Ver Ficha Técnica"
                    className="bg-blue-500 hover:bg-blue-600 transition-colors rounded p-2"
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>

                {/* ⏰ Historial de Stock */}
                <button
                    onClick={handleViewStockHistory}
                    title="Ver Historial de Stock"
                    className="bg-yellow-500 hover:bg-yellow-600 transition-colors rounded p-2"
                >
                    <ClockIcon className="w-5 h-5 text-white" />
                </button>

                {isStaff && (
                    <>
                        {/* 🛒 Agregar Orden */}
                        <button
                            onClick={() =>
                                onAddToOrder({ type: "createOrder", subproductData: subproduct })
                            }
                            title="Agregar Orden de Corte"
                            className="bg-indigo-500 hover:bg-indigo-600 transition-colors rounded p-2"
                        >
                            <ScissorsIcon className="w-5 h-5 text-white" />
                        </button>

                        {/* ✏️ Editar */}
                        <button
                            onClick={onEdit}
                            title="Editar Subproducto"
                            className="bg-primary-500 hover:bg-primary-600 transition-colors rounded p-2"
                        >
                            <PencilIcon className="w-5 h-5 text-white" />
                        </button>

                        {/* 🗑️ Eliminar */}
                        <button
                            onClick={onDelete}
                            title="Eliminar Subproducto"
                            className="bg-red-500 hover:bg-red-600 transition-colors rounded p-2"
                        >
                            <TrashIcon className="w-5 h-5 text-white" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubproductCard;
