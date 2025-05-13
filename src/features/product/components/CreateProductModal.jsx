import React, { useState, useEffect } from "react";
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
    });

    // Carga inicial y reset solo cuando se abre el modal
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
                console.error("Error al cargar datos iniciales:", err);
                setError("No se pudo conectar con el servidor.");
            }
        };

        fetchData();
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
        });
        setPreviewFiles([]);
        setError("");
        clearUploadError();
        setShowSuccess(false);
    }, [isOpen]);

    // Filtrar tipos al cambiar categoría
    useEffect(() => {
        if (formData.category) {
            const catId = parseInt(formData.category, 10);
            setFilteredTypes(types.filter((t) => t.category === catId));
        } else {
            setFilteredTypes([]);
        }
    }, [formData.category, types]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStockChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            initial_stock_quantity: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (formData.images.length + newFiles.length > 5) {
            setError("Máximo 5 archivos permitidos.");
            return;
        }
        const updated = [...formData.images, ...newFiles];
        setFormData((prev) => ({ ...prev, images: updated }));
        setPreviewFiles(updated.map((f) => f.name));
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
        clearUploadError();

        if (!validateCodeUnique()) return;

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
        data.append("category", formData.category);
        data.append("type", formData.type);

        const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
        if (parseFloat(stockVal) > 0) {
            data.set("initial_stock_quantity", stockVal);
        }

        try {
            setLoading(true);
            const newP = await createProduct(data);

            if (formData.images.length && !(await uploadFiles(newP.id, formData.images))) {
                return;
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {uploadError && (
                    <ErrorMessage message={uploadError} onClose={clearUploadError} />
                )}

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
                    label="Tipo"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={
                        filteredTypes.length
                            ? filteredTypes.map((t) => ({
                                value: String(t.id),
                                label: t.name,
                            }))
                            : [{ value: "", label: "Sin tipos disponibles" }]
                    }
                    required
                    disabled={!formData.category}
                />

                <FormInput
                    label="Nombre / Medida"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Código"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Marca"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <FormStockInput
                        label="Stock Inicial"
                        name="initial_stock_quantity"
                        value={formData.initial_stock_quantity}
                        onChange={handleStockChange}
                        placeholder="Ej: 100"
                    />
                    <FormInput
                        label="Ubicación"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Posición"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                    />
                </div>

                <FormInput
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <div className="mb-4">
                    <label
                        htmlFor="images"
                        className="block mb-2 text-sm font-medium text-text-secondary"
                    >
                        Archivos Multimedia (máx. 5)
                    </label>
                    <div className="flex items-center space-x-4">
                        <label
                            htmlFor="images"
                            className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600 transition-colors"
                        >
                            Seleccionar archivos
                        </label>
                        <span className="text-sm text-text-secondary">
                            {previewFiles.length
                                ? `${previewFiles.length} archivo(s) seleccionados`
                                : "Sin archivos seleccionados"}
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
                        <ul className="mt-2 ml-2 text-sm text-gray-600 space-y-1">
                            {previewFiles.map((nm, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="truncate">{nm}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                        title="Eliminar archivo"
                                    >
                                        ✖
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 mr-2"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
                        disabled={loading || uploading}
                    >
                        {loading || uploading ? "Guardando..." : "Crear Producto"}
                    </button>
                </div>
            </form>

            {showSuccess && (
                <SuccessMessage
                    message="¡Producto creado exitosamente!"
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </Modal>
    );
};

export default CreateProductModal;
