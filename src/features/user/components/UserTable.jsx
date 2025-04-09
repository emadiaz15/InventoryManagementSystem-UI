import React, { useMemo } from "react";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/ui/Pagination";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

const UserTable = ({
    users,
    openViewModal,
    openEditModal,
    openDeleteConfirmModal,
    goToNextPage,
    goToPreviousPage,
    nextPageUrl,
    previousPageUrl
}) => {

    // --- Cabeceras (Sin Cambios) ---
    const tableHeaders = useMemo(() => [
        "Username", "Nombre Completo", "Email", "DNI", "Rol", "Estado", "Acciones"
    ], []);

    // --- Filas (Con Botones Modificados) ---
    const tableRows = useMemo(() => users.map((user) => ({
        "Username": user.username || "N/A",
        "Nombre Completo": `${user.name || ''} ${user.last_name || ''}`.trim() || "N/A",
        "Email": user.email || "N/A",
        "DNI": user.dni || "N/A",
        "Rol": user.is_staff ? "Admin" : "Operario",
        "Estado": (
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
                }`}>
                {user.is_active ? "Activo" : "Inactivo"}
            </span>
        ),
        "Acciones": (
            <div className="flex items-center justify-center space-x-2">
                {/* --- BOTÓN VER - Estilo Modificado --- */}
                <button
                    key={`view-${user.id}`}
                    onClick={() => openViewModal(user)}
                    className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors" // <- Clases de TypeTable
                    aria-label="Ver usuario"
                    title="Ver Detalles"
                >
                    <EyeIcon className="w-5 h-5 text-white" /> {/* <- Icono blanco */}
                </button>
                {/* --- BOTÓN EDITAR - Estilo Modificado --- */}
                <button
                    key={`edit-${user.id}`}
                    onClick={() => openEditModal(user)}
                    className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors" // <- Clases de TypeTable
                    aria-label="Editar usuario"
                    title="Editar Usuario"
                >
                    {/* Asumiendo que text-text-white es un color válido o usar text-white */}
                    <PencilIcon className="w-5 h-5 text-white" />
                </button>
                {/* --- BOTÓN ELIMINAR - Estilo Modificado --- */}
                <button
                    key={`delete-${user.id}`}
                    onClick={() => openDeleteConfirmModal(user)}
                    className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors" // <- Clases de TypeTable
                    aria-label="Eliminar usuario"
                    title="Desactivar Usuario"
                >
                    {/* Asumiendo que text-text-white es un color válido o usar text-white */}
                    <TrashIcon className="w-5 h-5 text-white" />
                </button>
            </div>
        ),
    })), [users, openViewModal, openEditModal, openDeleteConfirmModal]);


    // --- Renderizado (Sin Cambios) ---
    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
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

export default UserTable;
