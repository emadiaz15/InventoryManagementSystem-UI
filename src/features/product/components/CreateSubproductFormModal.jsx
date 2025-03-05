import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { createProduct } from "../services/createProduct"; // 🔹 Usamos el mismo servicio para guardar subproductos
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";

const CreateSubproductFormModal = ({ isOpen, onClose, onSave, product }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        category: product?.category?.id || "",
        type: "",
        name: "",
        code: "",
        description: "",
        stock_quantity: 0,
        parent: product?.id || null, // 🔹 Relacionamos el subproducto con el producto padre
    });

    // 🔹 Cargar categorías y tipos al abrir el modal
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, typesResponse] = await Promise.all([
                    listCategories(),
                    listTypes(),
                ]);

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
    }, []);

    // 🔹 Filtrar tipos según la categoría seleccionada
    useEffect(() => {
        if (formData.category) {
            const categoryId = parseInt(formData.category, 10);
            const filtered = types.filter(type => type.category === categoryId);
            setFilteredTypes(filtered);

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
            ...(name === "category" && { type: "" }),
        }));
    };

    // 🔹 Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createProduct(formData);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            setError("No se pudo guardar el subproducto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Agregar Subproducto">
            <form onSubmit={handleSubmit}>
                {error && <ErrorMessage message={error} />}

                <FormSelect
                    label="Categoría"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                    required
                    loading={loadingCategories}
                    disabled
                />

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
                    disabled={!formData.category}
                />

                <FormInput label="Nombre" name="name" value={formData.name} onChange={handleChange} required />
                <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
                <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />
                <FormInput
                    label="Cantidad de Stock"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" onClick={onClose} className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Subproducto"}
                    </button>
                </div>
            </form>

            {showSuccess && <SuccessMessage message="¡Subproducto guardado con éxito!" onClose={() => setShowSuccess(false)} />}
        </Modal>
    );
};

export default CreateSubproductFormModal;
