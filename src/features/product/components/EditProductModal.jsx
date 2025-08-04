// src/features/product/components/EditProductModal.jsx
import React from "react";
import PropTypes from "prop-types";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/form/FormInput";
import FormStockInput from "@/features/product/components/FormStockInput";
import ErrorMessage from "@/components/common/ErrorMessage";
import SuccessMessage from "@/components/common/SuccessMessage";
import DeleteMessage from "@/components/common/DeleteMessage";
import ProductCarouselOverlay from "@/features/product/components/ProductCarouselOverlay";
import { useProducts } from "@/features/product/hooks/useProductHooks";
import { useUploadProductFiles, useDeleteProductFile } from "@/features/product/hooks/useProductFileHooks";
import { usePrefetchedData } from "@/context/DataPrefetchContext";
import { useEditProductForm } from "@/features/product/hooks/useEditProductForm";

export default function EditProductModal({ product, isOpen, onClose, onSave, children }) {
    const { categories, types } = usePrefetchedData();
    const { products, updateProduct } = useProducts({ page_size: 1000 });
    const uploadMut = useUploadProductFiles(product.id);
    const deleteMut = useDeleteProductFile(product.id);

    // form hook
    const {
        formData,
        previewFiles,
        error,
        loading,
        showSuccess,
        showSuggestions,
        loadingTypes,
        filteredTypes,
        isDeleting,
        deleteError,
        isDeleteOpen,
        fileToDelete,
        openDeleteRequest,
        closeDeleteRequest,
        setShowSuggestions,
        handleChange,
        handleStockChange,
        handleFileChange,
        removeFile,
        handleSubmit,
        confirmDelete,
    } = useEditProductForm({
        product,
        categories,
        types,
        products,
        updateProduct,
        uploadMut,
        onSave,
        onClose,
        deleteMut,
    });

    // inject delete trigger into carousel
    const childrenWithProps = React.Children.map(children, child =>
        React.isValidElement(child) && child.type === ProductCarouselOverlay
            ? React.cloneElement(child, {
                onDeleteRequest: openDeleteRequest,
                editable: true,
            })
            : child
    );

    if (!isOpen) return null;
    if (products.loading) {
        return (
            <Modal isOpen onClose={onClose} title="Cargando producto..." maxWidth="max-w-xl">
                <div className="p-6 text-center text-gray-600">Cargando datos...</div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Producto" maxWidth="max-w-6xl">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-4 bg-background-100 rounded max-h-[80vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <ErrorMessage message={error} onClose={() => {/* handled in hook */ }} />}
                        {showSuccess && <SuccessMessage message="Producto actualizado correctamente" />}

                        {/* Categoría */}
                        <div>
                            <label htmlFor="category-input" className="block text-sm font-medium text-text-secondary">Categoría *</label>
                            <input
                                id="category-input"
                                name="categoryInput"
                                type="text"
                                list="category-options"
                                value={formData.categoryInput}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-background-200"
                            />
                            <datalist id="category-options">
                                {categories.map(c => <option key={c.id} value={c.name} />)}
                            </datalist>
                        </div>

                        {/* Tipo */}
                        <div>
                            <label htmlFor="type-input" className="block text-sm font-medium text-text-secondary">Tipo (opcional)</label>
                            <div className="relative mt-1">
                                <input
                                    id="type-input"
                                    name="typeInput"
                                    type="text"
                                    autoComplete="off"
                                    disabled={!formData.category || loadingTypes}
                                    placeholder="Selecciona o escribe un tipo"
                                    value={formData.typeInput}
                                    onChange={handleChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 border-background-200 disabled:opacity-50"
                                />
                                {showSuggestions && formData.typeInput && (
                                    <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto bg-white border border-gray-300 rounded-md text-sm shadow-lg">
                                        {filteredTypes.filter(t => t.name.toLowerCase().includes(formData.typeInput.toLowerCase()))
                                            .map(t => (
                                                <li
                                                    key={t.id}
                                                    onMouseDown={() => handleChange({ target: { name: 'typeInput', value: t.name } })}
                                                    className="cursor-pointer px-4 py-2 hover:bg-primary-100"
                                                >{t.name}</li>
                                            ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Otros campos */}
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
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="has_subproducts" name="has_subproducts" checked={formData.has_subproducts} onChange={handleChange} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
                            <label htmlFor="has_subproducts" className="ml-2 text-sm">Este producto tiene subproductos</label>
                        </div>

                        {/* Archivos */}
                        <div>
                            <label className="block mb-2 text-sm font-medium">Archivos (máx. 5)</label>
                            <div className="flex items-center space-x-4">
                                <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600">Seleccionar archivos</label>
                                <span className="text-sm">{previewFiles.length ? `${previewFiles.length} archivo(s)` : "Sin archivos"}</span>
                            </div>
                            <input id="images" type="file" multiple accept="image/*,video/*,application/pdf" onChange={handleFileChange} className="hidden" />
                            {previewFiles.length > 0 && (
                                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                    {previewFiles.map((nm, i) => (<li key={i} className="flex items-center gap-2"><span className="truncate">{nm}</span><button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-600">✖</button></li>))}
                                </ul>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-2">
                            <button type="button" onClick={onClose} disabled={loading} className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600">Cancelar</button>
                            <button type="submit" disabled={loading} className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600">{loading ? "Guardando..." : "Actualizar Producto"}</button>
                        </div>

                        {showSuccess && <SuccessMessage message="¡Producto actualizado exitosamente!" />}
                    </form>
                </div>

                {/* Carrusel */}
                {childrenWithProps && (<div className="flex-1 p-4 bg-background-50 rounded max-h-[80vh] overflow-y-auto">{childrenWithProps}</div>)}
            </div>

            {/* Confirmar eliminación */}
            <DeleteMessage isOpen={isDeleteOpen} onClose={closeDeleteRequest} onDelete={confirmDelete} isDeleting={isDeleting} deleteError={deleteError?.message || null} itemName="el archivo" itemIdentifier={fileToDelete?.filename || fileToDelete?.name || ""} />
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
