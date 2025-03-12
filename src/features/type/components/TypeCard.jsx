import React from "react";

const TypeCard = ({ name, description, category, onClose }) => {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 p-5">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {name}
            </h5>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
                {description || "Sin descripción"}
            </p>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 mt-3 block">
                Categoría: {category}
            </span>
            <div className="flex items-center justify-end mt-4">
                <button
                    onClick={onClose}
                    className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default TypeCard;