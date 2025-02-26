// src/components/UserTable.jsx
import React from "react";
import Table from "../../../components/common/Table";

const UserTable = ({ headers, rows, loading }) => {
    if (loading) {
        return <p className="p-6">Cargando usuarios...</p>;
    }
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1">
            <Table headers={headers} rows={rows} />
        </div>
    );
};

export default UserTable;
