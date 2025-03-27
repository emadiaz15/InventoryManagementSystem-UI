import React from "react";
import { PencilIcon, TrashIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";

// Función para seleccionar aleatoriamente una imagen por defecto
const getDefaultImage = () => {
    const defaultImages = ["/rollo.png", "/bobina.png"];
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
};

const SubproductCard = ({ subproduct, onAddToOrder, onEdit, onDelete, onViewComments }) => {
    // Si no hay imagen definida en technical_sheet_photo, usa una por defecto aleatoria
    const imageUrl = subproduct.technical_sheet_photo || getDefaultImage();

    return (
        <div className="w-full max-w-sm bg-white border border-neutral-500 rounded-lg shadow-md dark:border-gray-700">
            <img
                className="p-4 rounded-t-lg"
                src={imageUrl}
                alt={subproduct.name}
            />
            <div className="px-5 pb-5">
                <h5 className="text-xl font-semibold tracking-tight text-text-primary">
                    {subproduct.name}
                </h5>
                <p className="text-sm text-text-primary">
                    {subproduct.description}
                </p>
                <ul className="mt-2 text-sm text-text-secondary">
                    <li><strong>Marca:</strong> {subproduct.brand}</li>
                    <li><strong>Número de bobina:</strong> {subproduct.number_coil}</li>
                    <li><strong>Longitud Inicial:</strong> {subproduct.initial_length}</li>
                    <li><strong>Longitud Final:</strong> {subproduct.final_length}</li>
                    <li><strong>Peso Total:</strong> {subproduct.total_weight}</li>
                    <li><strong>Peso de la Bobina:</strong> {subproduct.coil_weight}</li>
                    <li><strong>ID del Producto:</strong> {subproduct.parent}</li>
                    <li><strong>Cantidad:</strong> {subproduct.quantity}</li>
                    <li>
                        <strong>Estado:</strong> {subproduct.status ? "Activo" : "Inactivo"}
                    </li>
                </ul>
                <div className="mt-4">
                    <button
                        onClick={onAddToOrder}
                        className="w-full text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Agregar Orden de Corte
                    </button>
                </div>
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={onEdit}
                        className="p-2 bg-primary-500 hover:bg-primary-600 rounded"
                        title="Editar subproducto"
                    >
                        <PencilIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 bg-error-500 hover:bg-error-600 rounded"
                        title="Eliminar subproducto"
                    >
                        <TrashIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={onViewComments}
                        className="p-2 bg-success-500 hover:bg-success-600 rounded"
                        title="Ver comentarios"
                    >
                        <ChatBubbleLeftIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
                <div className="mt-4 text-xs text-text-secondary">
                    <p>
                        <strong>Fecha de creación:</strong>{" "}
                        {new Date(subproduct.created_at).toLocaleString()}
                    </p>
                    <p>
                        <strong>Creado por:</strong> {subproduct.created_by || "N/A"}
                    </p>
                    <p>
                        <strong>Última modificación:</strong>{" "}
                        {subproduct.modified_at ? new Date(subproduct.modified_at).toLocaleString() : "N/A"}
                    </p>
                    <p>
                        <strong>Modificado por:</strong> {subproduct.modified_by || "N/A"}
                    </p>
                    <p>
                        <strong>Fecha de borrado:</strong>{" "}
                        {subproduct.deleted_at ? new Date(subproduct.deleted_at).toLocaleString() : "N/A"}
                    </p>
                    <p>
                        <strong>Borrado por:</strong> {subproduct.deleted_by || "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubproductCard;
