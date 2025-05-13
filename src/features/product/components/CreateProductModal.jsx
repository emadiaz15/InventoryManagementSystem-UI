import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import FormStockInput from "../components/FormStockInput";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";

// Servicios
import { createProduct } from "../services/createProduct";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";
import { listProducts } from "../services/listProducts";

// Hook upload
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

    const { uploadFiles, uploadError, clearUploadError } = useProductFileUpload();

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        brand: "",
        location: "",
        category: "",
        type: "",
        initial_stock_quantity: "",
        images: [],
    });

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
                setError("Error al cargar categorías, tipos o productos.");
            }
        };

        fetchData();

        setFormData({
            name: "",
            code: "",
            description: "",
            brand: "",
            location: "",
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
        setFormData((prev) => ({
            ...prev,
            initial_stock_quantity: e.target.value.toString(),
        }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const totalSelected = formData.images.length + newFiles.length;

        if (totalSelected > 5) {
            setError("Máximo 5 archivos permitidos.");
            return;
        }

        const updatedFiles = [...formData.images, ...newFiles];
        setFormData((prev) => ({ ...prev, images: updatedFiles }));
        setPreviewFiles(updatedFiles.map((f) => f.name));
    };

    const removeFile = (indexToRemove) => {
        const updatedImages = formData.images.filter((_, idx) => idx !== indexToRemove);
        const updatedPreview = previewFiles.filter((_, idx) => idx !== indexToRemove);
        setFormData((prev) => ({ ...prev, images: updatedImages }));
        setPreviewFiles(updatedPreview);
    };

    const normalizeText = (text) => text.trim().toLowerCase().replace(/\s+/g, "");

    const validateCodeUnique = () => {
        const codeStr = normalizeText(formData.code);
        const codeClash = products.find((p) => {
            if (!p.code) return false;
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
        setShowSuccess(false);
        clearUploadError();

        if (!validateCodeUnique()) return;

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name.trim());

        const parsedCode = parseInt(formData.code.trim(), 10);
        if (isNaN(parsedCode)) {
            setError("El código debe ser un número válido.");
            return;
        }

        dataToSend.append("code", parsedCode);
        dataToSend.append("description", formData.description.trim());
        dataToSend.append("brand", formData.brand.trim());
        dataToSend.append("location", formData.location.trim());
        dataToSend.append("category", formData.category);
        dataToSend.append("type", formData.type);

        const stockValue = String(formData.initial_stock_quantity).replace(/[^0-9.]/g, "");
        if (parseFloat(stockValue) > 0) {
            dataToSend.set("initial_stock_quantity", stockValue.trim());
        }

        try {
            setLoading(true);
            const newProduct = await createProduct(dataToSend);

            if (formData.images.length > 0) {
                const uploadOk = await uploadFiles(newProduct.id, formData.images);
                if (!uploadOk) return;
            }

            setShowSuccess(true);
            onClose();
            if (onSave) onSave();
        } catch (err) {
            console.error("❌ Error al crear el producto:", err);
            setError(err.message || "No se pudo guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Producto">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {uploadError && <ErrorMessage message={uploadError} onClose={clearUploadError} />}

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
                    options={
                        filteredTypes.length > 0
                            ? filteredTypes.map((t) => ({
                                value: String(t.id),
                                label: t.name,
                            }))
                            : [{ value: "", label: "Sin tipos disponibles" }]
                    }
                    required
                    disabled={!formData.category}
                />

                <FormInput label="Nombre / Medida" name="name" value={formData.name} onChange={handleChange} required />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
                    <FormStockInput
                        label="Cantidad de Stock Inicial"
                        name="initial_stock_quantity"
                        value={formData.initial_stock_quantity}
                        onChange={handleStockChange}
                        placeholder="Ej: 100"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                    <FormInput label="Posición" name="location" value={formData.location} onChange={handleChange} />
                </div>

                <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-text-secondary" htmlFor="images">
                        Archivos Multimedia (máx. 5)
                    </label>

                    <div className="flex items-center space-x-4">
                        <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600 transition-colors">Seleccionar archivos</label>

                        <span className="text-sm text-text-secondary">
                            {previewFiles.length > 0
                                ? `${previewFiles.length} archivo(s) seleccionados`
                                : "Sin archivos seleccionados"}
                        </span>
                    </div>

                    <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*,video/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {previewFiles.length > 0 && (
                        <ul className="mt-2 ml-2 text-sm text-gray-600 space-y-1">
                            {previewFiles.map((fileName, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <span className="truncate">{fileName}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
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
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Crear Producto"}
                    </button>
                </div>
            </form>

            {showSuccess && (
                <SuccessMessage message="¡Producto creado exitosamente!" onClose={() => setShowSuccess(false)} />
            )}
        </Modal>
    );
};

export default CreateProductModal;
