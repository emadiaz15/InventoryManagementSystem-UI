import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import FormStockInput from "../components/FormStockInput";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

// Servicios
import { createProduct } from "../services/createProduct";
import { updateProduct } from "../services/updateProduct";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";
import { listProducts } from "../services/listProducts";

const CreateProductModal = ({
    product = null,
    isOpen,
    onClose,
    onSave,
}) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        brand: "",
        category: "",
        type: "",
        initial_stock_quantity: "",
        images: [],
    });

    const buttonLabel = product ? "Actualizar Producto" : "Crear Producto";

    useEffect(() => {
        if (!isOpen) return;

        const fetchData = async () => {
            try {
                const [catResp, typeResp, prodResp] = await Promise.all([
                    listCategories("/inventory/categories/?limit=1000&status=true"),
                    listTypes("/inventory/types/?limit=1000&status=true"),
                    listProducts("/inventory/products/"),
                ]);
                setCategories(catResp.results || []);
                setTypes(typeResp.results || []);
                setProducts(prodResp.results || []);
            } catch (err) {
                console.error("Error al cargar data inicial:", err);
                setError("Error al cargar categorías, tipos o productos.");
            }
        };

        fetchData();

        if (product) {
            setFormData({
                name: product.name || "",
                code: product.code !== null ? String(product.code) : "",
                description: product.description || "",
                brand: product.brand || "",
                category: product.category?.toString() || "",
                type: product.type?.toString() || "",
                initial_stock_quantity: "",
                images: [],
            });
        } else {
            setFormData({
                name: "",
                code: "",
                description: "",
                brand: "",
                category: "",
                type: "",
                initial_stock_quantity: "",
                images: [],
            });
        }
    }, [isOpen, product]);

    useEffect(() => {
        if (formData.category) {
            const catId = parseInt(formData.category, 10);
            const filtered = types.filter((t) => t.category === catId);
            setFilteredTypes(filtered);
        } else {
            setFilteredTypes([]);
        }
    }, [formData.category, types]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStockChange = (e) => {
        const { value } = e.target;
        const newVal = value.toString();
        setFormData((prev) => ({
            ...prev,
            initial_stock_quantity: newVal,
        }));
    };

    const handleFileChange = (e) => {
        const filesArray = Array.from(e.target.files);
        if (filesArray.length > 5) {
            setError("Solo puedes seleccionar hasta 5 imágenes.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            images: filesArray,
        }));
    };

    const normalizeText = (text) => text.trim().toLowerCase().replace(/\s+/g, "");

    const validateCodeUnique = () => {
        const codeStr = normalizeText(formData.code);
        const editingId = product?.id || null;
        const codeClash = products.find((p) => {
            if (!p.code) return false;
            if (p.id === editingId) return false;
            return normalizeText(String(p.code)) === codeStr;
        });
        if (codeClash) {
            setError("El código ya está en uso por otro producto.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateCodeUnique()) return;

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name.trim());

        const parsedCode = parseInt(formData.code.trim(), 10);
        if (isNaN(parsedCode)) {
            setError("El código debe ser un número entero válido.");
            return;
        }
        dataToSend.append("code", parsedCode);
        dataToSend.append("description", formData.description.trim());
        dataToSend.append("brand", formData.brand.trim());
        dataToSend.append("category", formData.category);
        dataToSend.append("type", formData.type);

        let stockValue = formData.initial_stock_quantity;
        if (Array.isArray(stockValue)) {
            stockValue = stockValue[0];
        }
        stockValue = String(stockValue).replace(/[^0-9.]/g, "");
        if (parseFloat(stockValue) > 0) {
            dataToSend.set("initial_stock_quantity", stockValue.trim());
        } else {
            dataToSend.delete("initial_stock_quantity");
        }

        formData.images.forEach((file) => {
            dataToSend.append("images", file);
        });

        try {
            setLoading(true);
            if (product?.id) {
                await updateProduct(product.id, dataToSend);
            } else {
                await createProduct(dataToSend);
            }

            onClose();
            setTimeout(() => {
                if (onSave) onSave();
            }, 200);
        } catch (err) {
            console.error("Error al guardar el producto:", err);
            setError(err.message || "No se pudo guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? "Editar Producto" : "Crear Nuevo Producto"}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}

                <FormSelect
                    label="Categoría"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories.map((cat) => ({
                        value: String(cat.id),
                        label: cat.name,
                    }))}
                    required
                />

                <FormSelect
                    label="Tipo"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={filteredTypes.length > 0
                        ? filteredTypes.map((t) => ({
                            value: String(t.id),
                            label: t.name,
                        }))
                        : [{ value: "", label: "Sin tipos disponibles" }]}
                    required
                    disabled={!formData.category}
                />

                <FormInput label="Nombre / Medida" name="name" value={formData.name} onChange={handleChange} required />
                <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
                <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />
                <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />

                <FormStockInput
                    label="Cantidad de Stock Inicial"
                    name="initial_stock_quantity"
                    value={formData.initial_stock_quantity}
                    onChange={handleStockChange}
                    placeholder="Ej: 100"
                />

                <FormInput label="Imágenes (máx. 5)" name="images" type="file" multiple onChange={handleFileChange} />

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors disabled:opacity-50 mr-2"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : buttonLabel}
                    </button>
                </div>
            </form>

            {showSuccess && (
                <SuccessMessage message="¡Producto guardado exitosamente!" onClose={() => setShowSuccess(false)} />
            )}
        </Modal>
    );
};

export default CreateProductModal;
