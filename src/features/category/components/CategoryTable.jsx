import React, { useMemo } from "react";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const CategoryTable = ({ categories, openViewModal, openEditModal, openDeleteConfirmModal, goToNextPage, goToPreviousPage, nextPageUrl, previousPageUrl }) => {
    const tableRows = useMemo(() => categories.map((category) => ({
        Nombre: category.name || "N/A",
        Descripción: category.description || "Sin descripción",
        Acciones: (
            <div className="flex space-x-2">
                <button
                    onClick={() => openViewModal(category)}
                    className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                    aria-label="Ver detalles"
                    title="Ver detalles de la categoría" // Tooltip para Ver
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>
                <button
                    onClick={() => openEditModal(category)}
                    className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                    aria-label="Editar tipo"
                    title="Editar la categoría" // Tooltip para Editar
                >
                    <PencilIcon className="w-5 h-5 text-text-white" />
                </button>
                <button
                    onClick={() => openDeleteConfirmModal(category)}
                    className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                    aria-label="Eliminar tipo"
                    title="Eliminar la categoría" // Tooltip para Eliminar
                >
                    <TrashIcon className="w-5 h-5 text-text-white" />
                </button>
            </div>
        ),
    })), [categories, openViewModal, openEditModal, openDeleteConfirmModal]);

    const tableHeaders = ["Categoría", "Descripción", "Acciones"];

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
                <Table headers={tableHeaders} rows={tableRows} />
            </div>
            <div className="mt-4">
                <Pagination
                    onNext={goToNextPage}
                    onPrevious={goToPreviousPage}
                    hasNext={Boolean(nextPageUrl)}
                    hasPrevious={Boolean(previousPageUrl)}
                />
            </div>
        </>
    );
};

export default CategoryTable;