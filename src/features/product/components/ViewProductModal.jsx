import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";

const ViewProductModal = ({ product, isOpen, onClose, children }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);

    // Traer categorías y tipos al abrir el modal
    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                const [catResp, typeResp] = await Promise.all([
                    listCategories("/inventory/categories/?limit=1000&status=true"),
                    listTypes("/inventory/types/?limit=1000&status=true"),
                ]);
                setCategories(catResp.results || []);
                setTypes(typeResp.results || []);
            } catch (err) {
                console.error("Error cargando categorías o tipos:", err);
            }
        };

        fetchData();
    }, [isOpen]);

    if (!product) return null;

    // Buscar el objeto para tener su nombre
    const categoryObj = categories.find((c) => c.id === product.category);
    const typeObj = types.find((t) => t.id === product.type);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalles del Producto"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col md:flex-row gap-4 h-full text-text-primary">
                <div className="flex-1 space-y-2 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    <p>
                        <span className="font-semibold">ID:</span> {product.id}
                    </p>
                    <p>
                        <span className="font-semibold">Código:</span> {product.code || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Tipo:</span>{" "}
                        {typeObj?.name || "Sin tipo"}
                    </p>
                    <p>
                        <span className="font-semibold">Nombre/Medida:</span>{" "}
                        {product.name || "SIN NOMBRE"}
                    </p>
                    <p>
                        <span className="font-semibold">Descripción:</span>{" "}
                        {product.description || "SIN DESCRIPCIÓN"}
                    </p>
                    <p>
                        <span className="font-semibold">Categoría:</span>{" "}
                        {categoryObj?.name || "Sin categoría"}
                    </p>
                    <p>
                        <span className="font-semibold">Estado:</span>{" "}
                        {product.status ? "Activo" : "Inactivo"}
                    </p>
                    <p>
                        <span className="font-semibold">Tiene subproductos? (Cables):</span>{" "}
                        {product.has_subproducts ? "Si" : "No"}
                    </p>
                    <p>
                        <span className="font-semibold">Stock actual:</span>{" "}
                        {product.current_stock ?? 0}
                    </p>
                    <p>
                        <span className="font-semibold">Marca:</span>{" "}
                        {product.brand || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Ubicación:</span>{" "}
                        {product.location || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Posición:</span>{" "}
                        {product.position || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Creado en:</span>{" "}
                        {product.created_at || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Modificado en:</span>{" "}
                        {product.modified_at || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Creado por:</span>{" "}
                        {product.created_by || "N/A"}
                    </p>
                    <p>
                        <span className="font-semibold">Modificado por:</span>{" "}
                        {product.modified_by || "N/A"}
                    </p>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* Zona para inyectar contenido adicional, p.ej. historial */}
                {children && (
                    <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                        {children}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewProductModal;
