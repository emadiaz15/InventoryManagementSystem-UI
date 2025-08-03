// src/features/product/components/EditProductModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/form/FormInput";
import FormStockInput from "@/features/product/components/FormStockInput";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessMessage from "@/components/common/SuccessMessage";
import DeleteMessage from "@/components/common/DeleteMessage";
import ProductCarouselOverlay from "@/features/product/components/ProductCarouselOverlay";
import { useProducts } from "@/features/product/hooks/useProductHooks";
import {
    useUploadProductFiles,
    useDeleteProductFile,
} from "@/features/product/hooks/useProductFileHooks";
import { usePrefetchedData } from "@/context/DataPrefetchContext";

export default function EditProductModal({
    product,
    isOpen,
    onClose,
    onSave,
    children,
}) {
    const { categories, types } = usePrefetchedData();
    const { products, updateProduct } = useProducts({ page_size: 1000 });

    // hooks para subir y eliminar archivos
    const uploadMut = useUploadProductFiles(product.id);
    const {
        deleteFile,               // la función que dispara la mutación
        deleting: isDeleting,     // estado de carga
        deleteError,              // posible error
    } = useDeleteProductFile(product.id);

    // estados del formulario
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
        brand: "",
        location: "",
        position: "",
        categoryInput: "",
        typeInput: "",
        category: null,
        type: "",
        initial_stock_quantity: "",
        has_subproducts: false,
        images: [],
    });
    const [previewFiles, setPreviewFiles] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // estados para eliminar un archivo existente
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    // Inject delete handler into carousel children
    const childrenWithProps = React.Children.map(children, (c) =>
        React.isValidElement(c) && c.type === ProductCarouselOverlay
            ? React.cloneElement(c, {
                onDeleteRequest: (f) => {
                    setFileToDelete(f);
                    setIsDeleteOpen(true);
                },
                editable: true,
            })
            : c
    );

    // Inicializar formulario al abrir
    useEffect(() => {
        if (!isOpen) return;
        const categoryName =
            categories.find((c) => c.id === product.category)?.name ?? "";
        const typeName = types.find((t) => t.id === product.type)?.name ?? "";

        setError("");
        setShowSuccess(false);
        setLoading(false);
        setPreviewFiles([]);
        setFormData({
            name: product.name ?? "",
            code: String(product.code ?? ""),
            description: product.description ?? "",
            brand: product.brand ?? "",
            location: product.location ?? "",
            position: product.position ?? "",
            categoryInput: categoryName,
            typeInput: typeName,
            category: String(product.category ?? ""),
            type: "", // se establecerá al hacer submit
            initial_stock_quantity: "",
            has_subproducts: !!product.has_subproducts,
            images: [],
        });
    }, [isOpen, product, categories, types]);

    // Filtrar types según categoría seleccionada
    const filteredTypes = useMemo(() => {
        const cid = parseInt(formData.category, 10);
        return cid
            ? types.filter((t) => t.category?.id === cid || t.category_id === cid)
            : [];
    }, [types, formData.category]);

    // Sincronizar categoría por texto
    useEffect(() => {
        const normalize = (txt) => txt.trim().toLowerCase();
        const found = categories.find(
            (c) => normalize(c.name) === normalize(formData.categoryInput)
        );
        setFormData((f) => ({
            ...f,
            category: found ? String(found.id) : null,
        }));
    }, [formData.categoryInput, categories]);

    // Limpiar tipo al cambiar categoría
    useEffect(() => {
        setFormData((f) => ({ ...f, typeInput: "", type: "" }));
    }, [formData.category]);

    const normalize = (txt) => txt.trim().toLowerCase().replace(/\s+/g, "");
    const validateCodeUnique = () => {
        const codeStr = normalize(formData.code);
        return !products.some(
            (p) => p.id !== product.id && normalize(String(p.code)) === codeStr
        );
    };

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    }, []);

    const handleStockChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((f) => ({ ...f, [name]: value }));
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 5) {
            setError("Máximo 5 archivos permitidos.");
            return;
        }
        setFormData((f) => ({ ...f, images: [...f.images, ...files] }));
        setPreviewFiles((p) => [...p, ...files.map((f) => f.name)]);
    };

    const removeFile = (idx) => {
        setFormData((f) => ({
            ...f,
            images: f.images.filter((_, i) => i !== idx),
        }));
        setPreviewFiles((p) => p.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setShowSuccess(false);

        if (!validateCodeUnique()) {
            setError("El código ya está en uso.");
            return;
        }
        const validCat = categories.find(
            (c) => String(c.id) === formData.category
        );
        if (!validCat) {
            setError("La categoría no existe.");
            return;
        }
        // Determinar typeId
        let typeId = "";
        if (formData.typeInput) {
            const validType = filteredTypes.find(
                (t) =>
                    t.name.trim().toLowerCase() ===
                    formData.typeInput.trim().toLowerCase()
            );
            if (!validType) {
                setError("El tipo no es válido para esa categoría.");
                return;
            }
            typeId = String(validType.id);
        }

        const codeNum = parseInt(formData.code.trim(), 10);
        if (isNaN(codeNum)) {
            setError("El código debe ser numérico.");
            return;
        }

        const fd = new FormData();
        fd.append("name", formData.name.trim());
        fd.append("code", codeNum);
        fd.append("description", formData.description.trim());
        fd.append("brand", formData.brand.trim());
        fd.append("location", formData.location.trim());
        fd.append("position", formData.position.trim());
        fd.append("category", formData.category);
        if (typeId) fd.append("type", typeId);
        fd.append("has_subproducts", formData.has_subproducts ? "true" : "false");
        const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "");
        if (stockVal) fd.append("initial_stock_quantity", stockVal);

        try {
            setLoading(true);
            await updateProduct(product.id, fd);
            if (formData.images.length) {
                await uploadMut.uploadFiles(formData.images);
            }
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
            onSave?.();
            onClose();
        } catch (err) {
            setError(err.message || "Error al actualizar el producto.");
        } finally {
            setLoading(false);
        }
    };

    // Función que confirma la eliminación de un archivo
    const confirmDelete = async () => {
        if (!fileToDelete) return;
        await deleteFile(fileToDelete.id);
        setIsDeleteOpen(false);
        onSave?.();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Producto"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col md:flex-row gap-4">
                {/* Formulario */}
                <div className="flex-1 p-4 bg-background-100 rounded max-h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <ErrorMessage message={String(error)} onClose={() => setError("")} />
                        )}
                        {showSuccess && (
                            <SuccessMessage message="Producto actualizado correctamente" />
                        )}

                        {/* Categoría */}
                        <div>
                            <label
                                htmlFor="category-input"
                                className="block text-sm font-medium text-text-secondary"
                            >
                                Categoría *
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="category-input"
                                    name="categoryInput"
                                    type="text"
                                    list="category-options"
                                    value={formData.categoryInput}
                                    onChange={handleChange}
                                    placeholder="Selecciona o escribe una categoría"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-background-200"
                                />
                                <datalist id="category-options">
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.name} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* Tipo */}
                        <div>
                            <label
                                htmlFor="type-input"
                                className="block text-sm font-medium text-text-secondary"
                            >
                                Tipo (opcional)
                            </label>
                            <div className="relative mt-1">
                                <input
                                    id="type-input"
                                    name="typeInput"
                                    type="text"
                                    value={formData.typeInput}
                                    onChange={handleChange}
                                    disabled={!formData.category}
                                    placeholder="Selecciona o escribe un tipo"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-background-200 disabled:opacity-50"
                                    autoComplete="off"
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                                {showSuggestions && formData.typeInput && filteredTypes.length > 0 && (
                                    <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white border border-gray-300 text-sm shadow-lg">
                                        {filteredTypes
                                            .filter((t) =>
                                                t.name.toLowerCase().includes(formData.typeInput.toLowerCase())
                                            )
                                            .map((t) => (
                                                <li
                                                    key={t.id}
                                                    onMouseDown={() => {
                                                        setFormData((f) => ({ ...f, typeInput: t.name }));
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="cursor-pointer px-4 py-2 hover:bg-primary-100"
                                                >
                                                    {t.name}
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Otros campos */}
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
                            <FormStockInput
                                label="Stock Inicial"
                                name="initial_stock_quantity"
                                value={formData.initial_stock_quantity}
                                onChange={handleStockChange}
                                placeholder="Ej: 100"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
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
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="has_subproducts"
                                name="has_subproducts"
                                checked={formData.has_subproducts}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="has_subproducts" className="ml-2 text-sm">
                                Este producto tiene subproductos
                            </label>
                        </div>

                        {/* Archivos */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Archivos (máx. 5)
                            </label>
                            <div className="flex items-center space-x-4">
                                <label
                                    htmlFor="images"
                                    className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600"
                                >
                                    Seleccionar archivos
                                </label>
                                <span className="text-sm">
                                    {previewFiles.length
                                        ? `${previewFiles.length} archivo(s)`
                                        : "Sin archivos"}
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

                        {/* Botones */}
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

                {/* Carrusel */}
                {childrenWithProps && (
                    <div className="flex-1 p-4 bg-background-50 rounded max-h-[80vh] overflow-y-auto">
                        {childrenWithProps}
                    </div>
                )}
            </div>

            {/* Confirmar eliminación de archivo */}
            <DeleteMessage
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onDelete={confirmDelete}
                isDeleting={isDeleting}
                deleteError={deleteError?.message || null}
                itemName="el archivo"
                itemIdentifier={fileToDelete?.filename || fileToDelete?.name || ""}
            />
        </Modal>
    );
}

EditProductModal.propTypes = {
    product: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    children: PropTypes.node,
};
