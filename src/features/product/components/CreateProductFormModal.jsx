import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { createProduct } from "../services/createProduct";
import { updateProduct } from "../services/updateProduct";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";

const CreateProductFormModal = ({ product = null, isOpen, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]); // 🔹 Lista de tipos filtrados
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        type: "",
        name: "",
        code: "",
        description: "",
        stock_quantity: 0,
        hasSubproducts: false,
    });

    // 🔹 Cargar categorías y tipos al abrir el modal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await listCategories();
                const typesResponse = await listTypes();

                // 🔥 Verifica si los datos existen antes de asignarlos
                const categoriesData = categoriesResponse?.results?.filter(cat => cat.status) || [];
                const typesData = typesResponse?.activeTypes || [];

                setCategories(categoriesData);
                setTypes(typesData);
            } catch (error) {
                setError("Error al cargar categorías y tipos.");
            } finally {
                setLoadingCategories(false);
                setLoadingTypes(false);
            }
        };

        fetchData();

        if (product) {
            setFormData({
                category: product.category?.id || "",
                type: product.type?.id || "",
                name: product.name || "",
                code: product.code || "",
                description: product.description || "",
                stock_quantity: product.stock_quantity || 0,
                hasSubproducts: product.hasSubproducts || false,
            });
        }
    }, [product]);

    // 🔹 Filtrar tipos según la categoría seleccionada
    useEffect(() => {
        if (formData.category) {
            const categoryId = parseInt(formData.category, 10);
            const filtered = types.filter(type => type.category === categoryId);
            setFilteredTypes(filtered);

            // 🔹 Si hay tipos disponibles, seleccionamos el primero
            setFormData(prev => ({
                ...prev,
                type: filtered.length ? filtered[0].id : "",
            }));
        } else {
            setFilteredTypes([]);
            setFormData(prev => ({ ...prev, type: "" }));
        }
    }, [formData.category, types]);

    // 🔹 Manejo de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "category" && { type: "" }), // 🔥 Si cambia la categoría, resetear tipo
        }));
    };

    // 🔹 Manejo del checkbox de "Tiene Subproductos"
    const handleSubproductChange = (e) => {
        const hasSubproducts = e.target.value === "true";
        setFormData(prev => ({
            ...prev,
            hasSubproducts,
            stock_quantity: hasSubproducts ? 0 : prev.stock_quantity, // 🔹 Resetear stock si tiene subproductos
        }));
    };

    // 🔹 Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (product) {
                await updateProduct(product.id, formData);
            } else {
                await createProduct(formData);
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            setError("No se pudo guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "Editar Producto" : "Crear Producto"}>
            <form onSubmit={handleSubmit}>
                {error && <ErrorMessage message={error} />}

                {/* 🔹 Selección de Categoría */}
                <FormSelect
                    label="Categoría"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    required
                    loading={loadingCategories}
                />

                {/* 🔹 Selección de Tipo basado en Categoría */}
                <FormSelect
                    label="Tipo"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={filteredTypes.length > 0
                        ? filteredTypes.map(type => ({ value: type.id, label: type.name }))
                        : [{ value: "", label: "No hay tipos disponibles" }]}
                    required
                    loading={loadingTypes || !formData.category}
                    disabled={!formData.category} // 🔥 Deshabilitar si no hay categoría seleccionada
                />

                {/* 🔹 Nombre y Código */}
                <FormInput label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
                <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />

                {/* 🔹 Selección de Subproductos */}
                <FormSelect
                    label="¿Tiene Subproductos?"
                    name="hasSubproducts"
                    value={formData.hasSubproducts.toString()} // 🔥 Convertir booleano a string
                    onChange={handleSubproductChange}
                    options={[
                        { value: "true", label: "Sí" },
                        { value: "false", label: "No" },
                    ]}
                    required
                />

                {/* 🔹 Mostrar Stock solo si no tiene subproductos */}
                {!formData.hasSubproducts && (
                    <FormInput
                        label="Cantidad de Stock"
                        name="stock_quantity"
                        type="number"
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        min="0"
                    />
                )}

                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" onClick={onClose} className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Producto"}
                    </button>
                </div>
            </form>

            {showSuccess && <SuccessMessage message="¡Producto guardado con éxito!" onClose={() => setShowSuccess(false)} />}
        </Modal>
    );
};

export default CreateProductFormModal;
