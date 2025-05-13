import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-3xl font-bold">403 · Acceso Denegado</h1>
        <p>No tienes permisos para ver esta página.</p>
        <Link to="/dashboard" className="text-primary-500 hover:underline">
            Volver al inicio
        </Link>
    </div>
);

export default Unauthorized;
