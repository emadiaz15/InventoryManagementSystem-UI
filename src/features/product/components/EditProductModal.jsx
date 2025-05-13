import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import FormStockInput from "../components/FormStockInput";
import ErrorMessage from "../../../components/common/ErrorMessage";
import SuccessMessage from "../../../components/common/SuccessMessage";
import DeleteMessage from "../../../components/common/DeleteMessage";
import PropTypes from "prop-types";

import { updateProduct } from "../services/updateProduct";
import { listCategories } from "../../category/services/listCategory";
import { listTypes } from "../../type/services/listType";
import { listProducts } from "../services/listProducts";

import { useProductFileUpload } from "../hooks/useProductFileUpload";
import { useProductFileDelete } from "../hooks/useProductFileDelete";

const EditProductModal = ({ product, isOpen, onClose, onSave, onDeleteSuccess, children }) => {
    // Form state
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
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    // File deletion state
    const { deleteFile, deleting, deleteError, clearDeleteError } = useProductFileDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    // File upload hook
    const { uploadFiles, uploadError } = useProductFileUpload();

    // Initial data load
    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            try {
                const [catRes, typeRes, prodRes] = await Promise.all([
                    listCategories("/inventory/categories/?limit=1000&status=true"),
                    listTypes("/inventory/types/?limit=1000&status=true"),
                    listProducts("/inventory/products/?limit=200"),
                ]);
                setCategories(catRes.results || []);
                setTypes(typeRes.results || []);
                setProducts(prodRes.results || []);
            } catch {
                setError("No se pudo cargar la información inicial.");
            }
        })();
    }, [isOpen]);

    // Preload form when opening
    useEffect(() => {
        if (!isOpen || !product) return;
        setFormData({
            name: product.name || "",
            code: product.code != null ? String(product.code) : "",
            description: product.description || "",
            brand: product.brand || "",
            location: product.location || "",
            category: product.category ? String(product.category) : "",
            type: product.type ? String(product.type) : "",
            initial_stock_quantity: "",
            images: [],
        });
        setPreviewFiles([]);
    }, [isOpen, product]);

    // Filter types by category
    useEffect(() => {
        if (!formData.category) {
            setFilteredTypes([]);
        } else {
            const catId = parseInt(formData.category, 10);
            setFilteredTypes(types.filter((t) => t.category === catId));
        }
    }, [formData.category, types]);

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleStockChange = (e) => {
        setFormData((prev) => ({ ...prev, initial_stock_quantity: e.target.value }));
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

    // Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setShowSuccess(false);
        if (!validateCodeUnique()) return;

        const data = new FormData();
        data.append("name", formData.name.trim());
        const parsed = parseInt(formData.code.trim(), 10);
        if (isNaN(parsed)) {
            setError("Código inválido.");
            return;
        }
        data.append("code", parsed);
        data.append("description", formData.description.trim());
        data.append("brand", formData.brand.trim());
        data.append("location", formData.location.trim());
        data.append("category", formData.category);
        data.append("type", formData.type);
        const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
        if (parseFloat(stockVal) > 0) data.append("initial_stock_quantity", stockVal);

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
            onSave && onSave();
        } catch (err) {
            setError(err.message || "Error al actualizar producto.");
        } finally {
            setLoading(false);
        }
    };

    // File delete request
    const handleDeleteRequest = (file) => {
        setFileToDelete(file);
        setIsDeleteOpen(true);
    };
    const confirmDelete = async () => {
        if (!fileToDelete) return;
        const success = await deleteFile(product.id, fileToDelete.id);
        if (success) {
            setIsDeleteOpen(false);
            onSave && onSave();
            onDeleteSuccess();
        }
    };

    // Clone children to pass delete handler
    const childrenWithProps = React.Children.map(children, (child) =>
        React.isValidElement(child)
            ? React.cloneElement(child, { onDeleteRequest: handleDeleteRequest })
            : child
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Producto" maxWidth="max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4 h-full text-text-primary">
                {/* Form panel */}
                <div className="flex-1 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                        <FormSelect label="Categoría" name="category" value={formData.category} onChange={handleChange}
                            options={categories.map((c) => ({ value: String(c.id), label: c.name }))} required />
                        <FormSelect label="Tipo" name="type" value={formData.type} onChange={handleChange}
                            options={filteredTypes.map((t) => ({ value: String(t.id), label: t.name }))}
                            required disabled={!formData.category} />
                        <FormInput label="Nombre / Medida" name="name" value={formData.name} onChange={handleChange} required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Código" name="code" value={formData.code} onChange={handleChange} required />
                            <FormStockInput label="Cantidad Inicial" name="initial_stock_quantity"
                                value={formData.initial_stock_quantity} onChange={handleStockChange} placeholder="Ej: 100" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                            <FormInput label="Ubicación" name="location" value={formData.location} onChange={handleChange} />
                        </div>
                        <FormInput label="Descripción" name="description" value={formData.description} onChange={handleChange} />
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Archivos Multimedia (máx. 5)</label>
                            <div className="flex items-center space-x-4">
                                <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600 transition-colors">Seleccionar archivos</label>
                                <span className="text-sm text-gray-600">
                                    {previewFiles.length > 0 ? `${previewFiles.length} seleccionado(s)` : "Sin archivos"}
                                </span>
                            </div>
                            <input id="images" name="images" type="file" multiple accept="image/*,video/*"
                                onChange={handleFileChange} className="hidden" />
                            {previewFiles.length > 0 && (
                                <ul className="mt-2 ml-2 text-sm text-gray-600 space-y-1">
                                    {previewFiles.map((fn, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="truncate">{fn}</span>
                                            <button type="button" onClick={() => removeFile(i)} className="text-error-500 hover:text-error-600">✖</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={onClose} className="bg-neutral-500 text-white hover:bg-neutral-600 px-4 py-2 rounded mr-2" disabled={loading}>Cancelar</button>
                            <button type="submit" className="bg-primary-500 text-white hover:bg-primary-600 px-4 py-2 rounded" disabled={loading}>
                                {loading ? "Guardando..." : "Actualizar Producto"}
                            </button>
                        </div>
                        {showSuccess && <SuccessMessage message="¡Producto actualizado exitosamente!" onClose={() => setShowSuccess(false)} />}
                    </form>
                </div>
                {/* Carousel / additional panel */}
                {childrenWithProps && (
                    <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                        {childrenWithProps}
                    </div>
                )}
            </div>
            {/* Delete confirmation */}
            <DeleteMessage
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onDelete={confirmDelete}
                isDeleting={deleting}
                deleteError={deleteError}
                clearDeleteError={clearDeleteError}
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
    children: PropTypes.node,
};

export default EditProductModal;
