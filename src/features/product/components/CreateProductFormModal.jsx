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
import { listProducts } from "../services/listProducts";
import CreateSubproductFormModal from "./CreateSubproductFormModal"; // 🔹 Importamos el modal de subproductos

const CreateProductFormModal = ({ product = null, isOpen, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingTypes, setLoadingTypes] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Guardar Producto");
    const [createdProduct, setCreatedProduct] = useState(null); // 🔹 Guardar producto recién creado
    const [showSubproductModal, setShowSubproductModal] = useState(false); // 🔹 Controla la apertura del modal de subproductos

    const [formData, setFormData] = useState({
        category: "",
        type: "",
        name: "",
        code: "",
        description: "",
        stock_quantity: 0,
        hasSubproducts: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, typesResponse, productsResponse] = await Promise.all([
                    listCategories(),
                    listTypes(),
                    listProducts(),
                ]);

                const categoriesData = categoriesResponse?.results?.filter(cat => cat.status) || [];
                const typesData = typesResponse?.activeTypes || [];
                const productsData = productsResponse?.results || [];

                setCategories(categoriesData);
                setTypes(typesData);
                setProducts(productsData);
            } catch (error) {
                setError("Error al cargar datos.");
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

    useEffect(() => {
        setButtonLabel(formData.hasSubproducts ? "Agregar Subproductos" : "Guardar Producto");
    }, [formData.hasSubproducts]);

    const normalizeText = (text) => text.toLowerCase().trim().replace(/\s+/g, "");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === "category" && { type: "" }),
        }));
    };

    const handleSubproductChange = (e) => {
        const hasSubproducts = e.target.value === "true";
        setFormData(prev => ({
            ...prev,
            hasSubproducts,
            stock_quantity: hasSubproducts ? 0 : prev.stock_quantity,
        }));
    };
    const validateDuplicates = () => {
        const normalizedName = normalizeText(String(formData.name || ""));
        const normalizedCode = normalizeText(String(formData.code || ""));

        const nameExists = products.some(product => normalizeText(String(product.name || "")) === normalizedName);
        const codeExists = products.some(product => normalizeText(String(product.code || "")) === normalizedCode);

        if (nameExists) {
            setError("Ya existe un producto con este nombre.");
            return false;
        }

        if (codeExists) {
            setError("Ya existe un producto con este código.");
            return false;
        }

        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateDuplicates()) return;

        setLoading(true);

        try {
            let savedProduct;
            if (product) {
                savedProduct = await updateProduct(product.id, formData);
            } else {
                savedProduct = await createProduct(formData);
            }

            setCreatedProduct(savedProduct); // 🔹 Guardamos el producto recién creado

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();

                if (formData.hasSubproducts) {
                    setShowSubproductModal(true); // 🔥 Abrimos el modal de subproductos si aplica
                }
            }, 2000);
        } catch (error) {
            setError("No se pudo guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={product ? "Editar Producto" : "Crear Producto"}>
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

                    <FormSelect
                        label="¿Tiene Subproductos?"
                        name="hasSubproducts"
                        value={formData.hasSubproducts.toString()}
                        onChange={handleSubproductChange}
                        options={[
                            { value: "true", label: "Sí" },
                            { value: "false", label: "No" },
                        ]}
                        required
                    />

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

                    <button type="submit" className="bg-primary-500 text-white py-2 px-4 rounded">
                        {loading ? "Guardando..." : buttonLabel}
                    </button>
                </form>

                {showSuccess && <SuccessMessage message="¡Producto guardado con éxito!" onClose={() => setShowSuccess(false)} />}
            </Modal>

            {/* 🔥 Modal para agregar subproductos */}
            {showSubproductModal && <CreateSubproductFormModal isOpen={showSubproductModal} onClose={() => setShowSubproductModal(false)} product={createdProduct} />}
        </>
    );
};

export default CreateProductFormModal;
