import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import FormStockInput from "../components/FormStockInput";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

import { createProduct } from "../services/createProduct";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";
import { listProducts } from "../services/listProducts";

import { useProductFileUpload } from "../hooks/useProductFileUpload";

const CreateProductModal = ({ isOpen, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [previewFiles, setPreviewFiles] = useState([]);

    const { uploadFiles, uploading, uploadError, clearUploadError } = useProductFileUpload();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        brand: "",
        location: "",
        position: "",
        category: "",
        type: "",
        initial_stock_quantity: "",
        images: [],
        has_subproduct: false,
    });

    useEffect(() => {
        if (!isOpen) return;

        clearUploadError();
        setError("");
        setShowSuccess(false);
        setPreviewFiles([]);
        setFormData({
            name: "",
            code: "",
            description: "",
            brand: "",
            location: "",
            position: "",
            category: "",
            type: "",
            initial_stock_quantity: "",
            images: [],
            has_subproduct: false,
        });

        const fetchData = async () => {
            try {
                const [catResp, typeResp, prodResp] = await Promise.all([
                    listCategories("/inventory/categories/?limit=1000&status=true"),
                    listTypes("/inventory/types/?limit=1000&status=true"),
                    listProducts("/inventory/products/"),
                ]);

                setCategories(catResp.results || []);
                const allTypes = typeResp.results ?? typeResp.activeTypes ?? (Array.isArray(typeResp) ? typeResp : []);
                setTypes(allTypes);
                setProducts(prodResp.results || []);
            } catch (err) {
                console.error("Error al cargar datos iniciales:", err);
                setError("No se pudo conectar con el servidor.");
            }
        };

        fetchData();
    }, [isOpen]);

    useEffect(() => {
        if (!formData.category) {
            setFilteredTypes(types);
            return;
        }

        const catId = parseInt(formData.category, 10);
        setFilteredTypes(
            types.filter((t) => {
                if (t.category && typeof t.category === "object") return t.category.id === catId;
                if (typeof t.category_id !== "undefined") return t.category_id === catId;
                return t.category === catId;
            })
        );
    }, [formData.category, types]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleStockChange = (e) =>
        setFormData((prev) => ({
            ...prev,
            initial_stock_quantity: e.target.value,
        }));

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 5) {
            setError("Máximo 5 archivos permitidos.");
            return;
        }
        const imgs = [...formData.images, ...files];
        setFormData((prev) => ({ ...prev, images: imgs }));
        setPreviewFiles(imgs.map((f) => f.name));
    };

    const removeFile = (idx) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx),
        }));
        setPreviewFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const normalize = (txt) => txt.trim().toLowerCase().replace(/\s+/g, "");
    const validateCodeUnique = () => {
        const codeStr = normalize(formData.code);
        const clash = products.find(
            (p) => p.code && normalize(String(p.code)) === codeStr
        );
        if (clash) {
            setError("El código ya está en uso por otro producto.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setShowSuccess(false);

        if (!validateCodeUnique()) return;
        if (!formData.category) {
            setError("Por favor, selecciona una categoría.");
            return;
        }

        const data = new FormData();
        data.append("name", formData.name.trim());
        const codeNum = parseInt(formData.code.trim(), 10);
        if (isNaN(codeNum)) {
            setError("El código debe ser un número válido.");
            return;
        }

        data.append("code", codeNum);
        data.append("description", formData.description.trim());
        data.append("brand", formData.brand.trim());
        data.append("location", formData.location.trim());
        data.append("position", formData.position.trim());
        data.append("category", parseInt(formData.category, 10));

        if (formData.type) {
            data.append("type", parseInt(formData.type, 10));
        }

        const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
        if (parseFloat(stockVal) > 0) {
            data.append("initial_stock_quantity", stockVal);
        }

        data.append("has_subproduct", formData.has_subproduct ? "true" : "false");

        try {
            setLoading(true);
            const newP = await createProduct(data);

            if (formData.images.length) {
                const ok = await uploadFiles(newP.id, formData.images);
                if (!ok && uploadError) {
                    setError(uploadError);
                    return;
                }
            }

            setShowSuccess(true);
            onClose();
            onSave?.();
        } catch (err) {
            console.error("Error al crear:", err);
            setError(err.message || "No se pudo guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Producto">
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {uploadError && <ErrorMessage message={uploadError} onClose={clearUploadError} />}

                <FormSelect
                    label="Categoría"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categories.map((c) => ({
                        value: String(c.id),
                        label: c.name,
                    }))}
                    required
                />

                <FormSelect
                    label="Tipo (opcional)"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={filteredTypes.map((t) => ({
                        value: String(t.id),
                        label: t.name,
                    }))}
                />

                <FormInput
                    label="Nombre / Medida"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
                    <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormStockInput
                        label="Stock Inicial"
                        name="initial_stock_quantity"
                        value={formData.initial_stock_quantity}
                        onChange={handleStockChange}
                        placeholder="Ej: 100"
                    />
                    <FormInput label="Ubicación" name="location" value={formData.location} onChange={handleChange} />
                    <FormInput label="Posición" name="position" value={formData.position} onChange={handleChange} />
                </div>

                <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />

                <div className="flex items-center ps-4 border border-background-200 rounded-sm bg-background-100 text-text-primary h-[46px]">
                    <input
                        id="has_subproduct"
                        type="checkbox"
                        name="has_subproduct"
                        checked={formData.has_subproduct}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                    />
                    <label htmlFor="has_subproduct" className="ms-2 text-sm font-medium">
                        Este producto tiene subproductos (Cables)
                    </label>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium">Archivos (máx. 5)</label>
                    <div className="flex items-center space-x-4">
                        <label
                            htmlFor="images"
                            className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600"
                        >
                            Seleccionar archivos
                        </label>
                        <span className="text-sm text-text-secondary">
                            {previewFiles.length ? `${previewFiles.length} archivo(s)` : "Sin archivos"}
                        </span>
                    </div>

                    <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*,video/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    {previewFiles.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                            {previewFiles.map((nm, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="truncate">{nm}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                    >
                        {loading || uploading ? "Guardando..." : "Crear Producto"}
                    </button>
                </div>

                {showSuccess && (
                    <SuccessMessage
                        message="¡Producto creado exitosamente!"
                        onClose={() => setShowSuccess(false)}
                    />
                )}
            </form>
        </Modal>
    );
};

CreateProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
};

export default CreateProductModal;
