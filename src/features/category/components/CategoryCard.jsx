import React from "react";

const CategoryCard = ({ name, description, onClose }) => {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 p-5">
            <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                {name}
            </h5>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
                {description || "Sin descripción"}
            </p>
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

export default CategoryCard;