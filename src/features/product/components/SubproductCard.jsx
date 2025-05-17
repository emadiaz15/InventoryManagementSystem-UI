import React from "react";
import { PencilIcon, TrashIcon, EyeIcon, ClockIcon, ScissorsIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../context/AuthProvider";

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
    onViewStock,
}) => {
    const imageUrl = subproduct.technical_sheet_photo
        ? subproduct.technical_sheet_photo
        : getDefaultImage(subproduct.form_type);
    const { user } = useAuth();
    const isStaff = user?.is_staff;
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 md:max-w-2xl w-full">
            {/* Header: mostrar tipo y nombre del producto padre */}
            <div className="flex justify-between px-4 py-2 border-b">
                <span className="text-1xl font-bold text-gray-800 truncate">
                    {subproduct.parent_type_name} - {subproduct.parent_name}
                </span>
                <strong>{subproduct.initial_stock_quantity} Mts</strong>
            </div>

            {/* Content: image + details */}
            <div className="flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-6">
                <img
                    className="object-cover w-full h-40 md:w-48 md:h-48 rounded"
                    src={imageUrl}
                    alt={subproduct.name}
                />
                <ul className="flex-1 text-sm text-gray-700 space-y-1 overflow-hidden">
                    <li><strong>Marca:</strong> {subproduct.brand}</li>
                    <li><strong>Bobina N°:</strong> {subproduct.number_coil}</li>
                    <li><strong>Ubicación:</strong> {subproduct.location}</li>
                    <li><strong>Estado:</strong> {subproduct.status ? "Disponible" : "Completada"}</li>
                </ul>
            </div>

            {/* Actions: full width buttons row */}
            <div className="flex flex-wrap justify-center items-center space-x-2 p-4 border-t">
                {/* 👁️ Ver Ficha Técnica (todos) */}
                <button
                    onClick={onViewDetails}
                    title="Ver Ficha Técnica"
                    className="bg-blue-500 hover:bg-blue-600 transition-colors rounded p-2"
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>

                {/* ⏰ Ver Historial de Stock (todos) */}
                <button
                    onClick={onViewStock}
                    title="Ver Historial de Stock"
                    className="bg-yellow-500 hover:bg-yellow-600 transition-colors rounded p-2"
                >
                    <ClockIcon className="w-5 h-5 text-white" />
                </button>

                {isStaff && (
                    <>
                        {/* 🛒 Agregar Orden */}
                        <button
                            onClick={onAddToOrder}
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
