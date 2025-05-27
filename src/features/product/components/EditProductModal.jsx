import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import FormStockInput from "../components/FormStockInput";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";
import DeleteMessage from "../../../components/common/DeleteMessage";

import { updateProduct } from "../services/updateProduct";
import { listProducts } from "../services/listProducts";
import { usePrefetchedData } from "../../../context/DataPrefetchContext";

import { useProductFileUpload } from "../hooks/useProductFileUpload";
import { useProductFileDelete } from "../hooks/useProductFileDelete";
import ProductCarouselOverlay from "../components/ProductCarouselOverlay";

const EditProductModal = ({ product, isOpen, onClose, onSave, onDeleteSuccess, children }) => {
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
        has_subproducts: false,
    });

    const [products, setProducts] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const { categories, types } = usePrefetchedData();
    const { uploadFiles, uploadError, clearUploadError } = useProductFileUpload();
    const { deleteFile, deleting, deleteError } = useProductFileDelete();

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        clearUploadError();
        setError("");
        setShowSuccess(false);
        setPreviewFiles([]);

        setFormData({
            name: product.name ?? "",
            code: product.code != null ? String(product.code) : "",
            description: product.description ?? "",
            brand: product.brand ?? "",
            location: product.location ?? "",
            position: product.position ?? "",
            category: product.category != null ? String(product.category) : "",
            type: product.type != null ? String(product.type) : "",
            initial_stock_quantity: "",
            images: [],
            has_subproducts: !!product.has_subproducts,
        });

        (async () => {
            try {
                const res = await listProducts("/inventory/products/?limit=1000");
                setProducts(res.results || []);
            } catch (err) {
                setError("No se pudieron cargar los productos.");
            }
        })();
    }, [isOpen, product]);

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

    const handleStockChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            initial_stock_quantity: e.target.value,
        }));
    };

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

    const validateCodeUnique = () => {
        const codeNorm = formData.code.trim().toLowerCase();
        const duplicate = products.find(
            (p) => p.id !== product.id && String(p.code).trim().toLowerCase() === codeNorm
        );
        if (duplicate) {
            setError("El código ya está en uso.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setShowSuccess(false);

        if (!validateCodeUnique()) return;

        const data = new FormData();
        data.append("name", formData.name.trim());

        const parsedCode = parseInt(formData.code.trim(), 10);
        if (isNaN(parsedCode)) {
            setError("El código debe ser un número válido.");
            return;
        }

        data.append("code", parsedCode);
        data.append("description", formData.description.trim());
        data.append("brand", formData.brand.trim());
        data.append("location", formData.location.trim());
        data.append("position", formData.position.trim());
        data.append("category", formData.category);
        data.append("type", formData.type);
        data.append("has_subproducts", formData.has_subproducts ? "true" : "false");

        const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
        if (parseFloat(stockVal) > 0) {
            data.append("initial_stock_quantity", stockVal);
        }

        try {
            setLoading(true);
            await updateProduct(product.id, data);

            if (formData.images.length) {
                const ok = await uploadFiles(product.id, formData.images);
                if (!ok && uploadError) {
                    setError(uploadError);
                    return;
                }
            }

            setShowSuccess(true);
            onClose();
            onSave?.();
        } catch (err) {
            setError(err.message || "Error al actualizar el producto.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRequest = (file) => {
        setFileToDelete(file);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!fileToDelete) return;
        const success = await deleteFile(product.id, fileToDelete.id);
        if (success) {
            setIsDeleteOpen(false);
            onDeleteSuccess?.();
            onSave?.();
        }
    };

    const childrenWithProps = React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === ProductCarouselOverlay
            ? React.cloneElement(child, { onDeleteRequest: handleDeleteRequest })
            : child
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Producto" maxWidth="max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                        {uploadError && <ErrorMessage message={uploadError} onClose={clearUploadError} />}

                        <FormSelect
                            label="Categoría"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
                            required
                        />

                        <FormSelect
                            label="Tipo (opcional)"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={filteredTypes.map((t) => ({ value: String(t.id), label: t.name }))}
                            disabled={!formData.category}
                        />

                        <FormInput label="Nombre / Medida" name="name" value={formData.name} onChange={handleChange} required />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
                            <FormStockInput label="Stock Inicial" name="initial_stock_quantity" value={formData.initial_stock_quantity} onChange={handleStockChange} placeholder="Ej: 100" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                            <FormInput label="Ubicación" name="location" value={formData.location} onChange={handleChange} />
                            <FormInput label="Posición" name="position" value={formData.position} onChange={handleChange} />
                        </div>

                        <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />

                        <div className="flex items-center ps-4 border border-background-200 rounded-sm bg-background-100 text-text-primary h-[46px]">
                            <input id="has_subproducts" type="checkbox" name="has_subproducts" checked={formData.has_subproducts}
                                onChange={handleChange} className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                            />
                            <label htmlFor="has_subproducts" className="ms-2 text-sm font-medium">
                                Este producto tiene subproductos (Cables)
                            </label>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Archivos (máx. 5)</label>
                            <div className="flex items-center space-x-4">
                                <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600">
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
                                disabled={loading}
                                className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
                            >
                                {loading ? "Guardando..." : "Actualizar Producto"}
                            </button>
                        </div>

                        {showSuccess && (
                            <SuccessMessage
                                message="¡Producto actualizado exitosamente!"
                                onClose={() => setShowSuccess(false)}
                            />
                        )}
                    </form>
                </div>

                {childrenWithProps && (
                    <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                        {childrenWithProps}
                    </div>
                )}
            </div>

            <DeleteMessage
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onDelete={confirmDelete}
                isDeleting={deleting}
                deleteError={deleteError}
                itemName="el archivo"
                itemIdentifier={fileToDelete?.filename || fileToDelete?.name || ""}
            />
        </Modal>
    );
};

EditProductModal.propTypes = {
    product: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    children: PropTypes.node,
};

export default EditProductModal;
