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
    const tableHeaders = useMemo(() => [
        "Usuario", "Nombre Completo", "Email", "DNI", "Rol", "Acciones"
    ], []);

    const tableRows = useMemo(() =>
        users.map((user) => {
            // corregir esquema en local: forzar HTTP si viene con HTTPS
            const rawImageUrl = user.image_signed_url || user.image_url;
            const imageUrl = rawImageUrl?.startsWith("https://localhost:9000")
                ? rawImageUrl.replace(/^https:\/\//, "http://")
                : rawImageUrl;

            return {
                "Usuario": (
                    <div className="flex items-center space-x-3">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={`Avatar de ${user.username}`}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white font-bold uppercase">
                                {user.username?.[0] || "U"}
                            </div>
                        )}
                        <span>{user.username || "N/A"}</span>
                    </div>
                ),
                "Nombre Completo": `${user.name || ''} ${user.last_name || ''}`.trim() || "N/A",
                "Email": user.email || "N/A",
                "DNI": user.dni || "N/A",
                "Rol": user.is_staff ? "Administrador" : "Operario",
                "Acciones": (
                    <div className="flex space-x-2 justify-center">
                        <button
                            onClick={() => openViewModal(user)}
                            className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                            aria-label="Ver usuario"
                            title="Ver Detalles"
                        >
                            <EyeIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => openEditModal(user)}
                            className="bg-primary-500 p-2 rounded hover:bg-primary-600 transition-colors"
                            aria-label="Editar usuario"
                            title="Editar Usuario"
                        >
                            <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={() => openDeleteConfirmModal(user)}
                            className="bg-red-500 p-2 rounded hover:bg-red-600 transition-colors"
                            aria-label="Eliminar usuario"
                            title="Desactivar Usuario"
                        >
                            <TrashIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                )
            };
        }),
        [users, openViewModal, openEditModal, openDeleteConfirmModal]
    );

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
