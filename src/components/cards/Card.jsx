import React from "react";

const Card = ({ image, title, stock, onAddToOrder }) => {
    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
            <a href="#">
                <img className="p-8 rounded-t-lg" src={image} alt={title} />
            </a>
            <div className="px-5 pb-5">
                <a href="#">
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {title}
                    </h5>
                </a>
                <div className="flex items-center mt-2.5 mb-5">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
                        Stock: {stock}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        onClick={onAddToOrder}
                        className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Agregar Orden de Corte
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;