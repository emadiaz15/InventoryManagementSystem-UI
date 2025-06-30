import React, { useMemo } from "react";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const TypeTable = ({ types, openViewModal, openEditModal, openDeleteConfirmModal, goToNextPage, goToPreviousPage, nextPageUrl, previousPageUrl, getCategoryName }) => {
    // Verificación inicial de datos
    if (!types || !getCategoryName) {
        return <div>Cargando datos...</div>; // O un mensaje de carga más informativo
    }

    const tableRows = useMemo(() => types.map((type) => ({
        Nombre: type.name || "N/A",
        Descripción: type.description || "Sin descripción",
        Categoría: getCategoryName(type.category) || "SIN CATEGORÍA",
        Acciones: (
            <div className="flex space-x-2">
                <button
                    key={`view-${type.id}`}
                    onClick={() => {
                        openViewModal(type);
                    }}
                    className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                    aria-label="Ver detalles"
                    title="Ver detalles del tipo"
                >
                    <EyeIcon className="w-5 h-5 text-white" />
                </button>
                <button
                    key={`edit-${type.id}`}
                    onClick={() => openEditModal(type)}
                    className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                    aria-label="Editar tipo"
                    title="Editar el tipo"
                >
                    <PencilIcon className="w-5 h-5 text-text-white" />
                </button>
                <button
                    key={`delete-${type.id}`}
                    onClick={() => openDeleteConfirmModal(type)}
                    className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                    aria-label="Eliminar tipo"
                    title="Eliminar el tipo"
                >
                    <TrashIcon className="w-5 h-5 text-text-white" />
                </button>
            </div>
        ),
    })), [types, openViewModal, openEditModal, openDeleteConfirmModal, getCategoryName]);

    const tableHeaders = useMemo(() => ["Tipo", "Descripción", "Categoría", "Acciones"], []);

    // No es necesario usar useMemo si paginationProps no es un cuello de botella
    const paginationProps = {
        onNext: goToNextPage,
        onPrevious: goToPreviousPage,
        hasNext: Boolean(nextPageUrl),
        hasPrevious: Boolean(previousPageUrl),
    };

    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2">
                <Table headers={tableHeaders} rows={tableRows} />
            </div>
            <div className="mt-4">
                <Pagination {...paginationProps} />
            </div>
        </>
    );
};

export default TypeTable;