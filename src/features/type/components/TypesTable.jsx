import React from "react";
import Table from "../components/common/Table";
import ActionsButtons from "..components/ui/ActionsButtons";

const TypesTable = ({ types, onEdit, onDelete }) => {
    const headers = ["Categoría", "Nombre de Tipo", "Descripción", "Acciones"];

    const rows = types.map((type) => ({
        "Categoría": getCategoryName(type.category) || "SIN CATEGORÍA",
        "Nombre de Tipo": type.name ? type.name.toUpperCase() : "SIN NOMBRE",
        "Descripción": type.description ? type.description.toUpperCase() : "SIN DESCRIPCIÓN",
        "Acciones": (
            <ActionsButtons
                type={type}
                onEdit={handleEditType}
                onDelete={handleToggleStatus}
            />
        ),
    }));

    return <Table headers={headers} rows={rows} />;
};

export default TypesTable;
