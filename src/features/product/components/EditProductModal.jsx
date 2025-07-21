// src/features/product/components/EditProductModal.jsx
import React, { useState, useEffect, useMemo } from "react"
import PropTypes from "prop-types"

import Modal from "@/components/ui/Modal"
import FormInput from "@/components/ui/form/FormInput"
import FormSelect from "@/components/ui/form/FormSelect"
import FormStockInput from "../components/FormStockInput"
import ErrorMessage from "@/components/common/ErrorMessage"
import SuccessMessage from "@/components/common/SuccessMessage"
import DeleteMessage from "@/components/common/DeleteMessage"

import { useProducts } from "@/features/product/hooks/useProductHooks"
import {
    useUploadProductFiles,
    useDeleteProductFile,
} from "@/features/product/hooks/useProductFileHooks"
import { usePrefetchedData } from "@/context/DataPrefetchContext"
import ProductCarouselOverlay from "../components/ProductCarouselOverlay"

const EditProductModal = ({
    product,
    isOpen,
    onClose,
    onSave,
    children,
}) => {
    // 📦 Data global pre‐cargada
    const { categories, types } = usePrefetchedData()

    // 🔄 Hook combinado: lista + actualización de productos
    const { products = [], updateProduct } = useProducts({ page_size: 1000 })

    // 📁 Hooks de archivos
    const {
        uploadFiles,
        status: uploadStatus,
        error: uploadError,
    } = useUploadProductFiles()
    const {
        deleteFile,
        status: deleteStatus,
        error: deleteError,
    } = useDeleteProductFile()

    // 1️⃣ Estado del formulario
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
        has_subproducts: false,
        images: [],
    })
    const [previewFiles, setPreviewFiles] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // 2️⃣ Estado para confirmación de borrado de archivo
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [fileToDelete, setFileToDelete] = useState(null)

    // 3️⃣ Inicializar formulario al abrir modal
    useEffect(() => {
        if (!isOpen) return
        setError("")
        setShowSuccess(false)
        setPreviewFiles([])
        setLoading(false)
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
            has_subproducts: !!product.has_subproducts,
            images: [],
        })
    }, [isOpen, product])

    // 4️⃣ Filtrar tipos según categoría seleccionada
    const filteredTypes = useMemo(() => {
        const catId = parseInt(formData.category, 10)
        if (!catId) return types
        return types.filter((t) => {
            if (t.category && typeof t.category === "object") return t.category.id === catId
            if (t.category_id != null) return t.category_id === catId
            return t.category === catId
        })
    }, [types, formData.category])

    // 5️⃣ Handlers de inputs
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target
        setFormData((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }))
    }
    const handleStockChange = (e) => {
        setFormData((f) => ({ ...f, initial_stock_quantity: e.target.value }))
    }
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (formData.images.length + files.length > 5) {
            setError("Máximo 5 archivos permitidos.")
            return
        }
        setFormData((f) => ({ ...f, images: [...f.images, ...files] }))
        setPreviewFiles((p) => [...p, ...files.map((f) => f.name)])
    }
    const removeFile = (idx) => {
        setFormData((f) => ({
            ...f,
            images: f.images.filter((_, i) => i !== idx),
        }))
        setPreviewFiles((p) => p.filter((_, i) => i !== idx))
    }
    // Validación de código único
    const validateCodeUnique = () => {
        const norm = formData.code.trim().toLowerCase()
        const dup = products.find(
            (p) =>
                p.id !== product.id &&
                String(p.code).trim().toLowerCase() === norm
        )
        if (dup) {
            setError("El código ya está en uso.")
            return false
        }
        return true
    }

    // 6️⃣ Submit de formulario
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setShowSuccess(false)
        if (!validateCodeUnique()) return

        const data = new FormData()
        data.append("name", formData.name.trim())
        const parsedCode = parseInt(formData.code.trim(), 10)
        if (isNaN(parsedCode)) {
            setError("El código debe ser un número válido.")
            return
        }
        data.append("code", parsedCode)
        data.append("description", formData.description.trim())
        data.append("brand", formData.brand.trim())
        data.append("location", formData.location.trim())
        data.append("position", formData.position.trim())
        data.append("category", formData.category)
        data.append("type", formData.type || "")
        data.append("has_subproducts", formData.has_subproducts ? "true" : "false")
        const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "")
        if (parseFloat(stockVal) > 0) {
            data.append("initial_stock_quantity", stockVal)
        }

        try {
            setLoading(true)
            // Llama al hook de actualización
            await updateProduct(product.id, data)
            // Si hay imágenes nuevas, las sube
            if (formData.images.length) {
                await uploadFiles({ productId: product.id, files: formData.images })
            }
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 2000)
            onClose()
            onSave?.()
        } catch (err) {
            setError(err.message || "Error al actualizar el producto.")
        } finally {
            setLoading(false)
        }
    }

    // 7️⃣ Borrar archivo existente
    const handleDeleteRequest = (file) => {
        setFileToDelete(file)
        setIsDeleteOpen(true)
    }
    const confirmDelete = async () => {
        if (!fileToDelete) return
        await deleteFile({ productId: product.id, fileId: fileToDelete.id })
        setIsDeleteOpen(false)
        onSave?.()
    }

    // 8️⃣ Inyectar onDeleteRequest en el carousel
    const childrenWithProps = React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === ProductCarouselOverlay
            ? React.cloneElement(child, { onDeleteRequest: handleDeleteRequest })
            : child
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Producto"
            maxWidth="max-w-6xl"
        >
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-background-100 p-4 rounded overflow-y-auto max-h-[80vh]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                        {uploadError && <ErrorMessage message={uploadError} onClose={() => { }} />}

                        {/* Categoría */}
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

                        {/* Tipo */}
                        <FormSelect
                            label="Tipo (opcional)"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "N/A" },
                                ...filteredTypes.map((t) => ({
                                    value: String(t.id),
                                    label: t.name,
                                })),
                            ]}
                            disabled={!formData.category}
                        />

                        {/* Nombre / Medida */}
                        <FormInput
                            label="Nombre / Medida"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        {/* Código y stock inicial */}
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

                        {/* Marca, Ubicación, Posición */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormInput
                                label="Marca"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
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

                        {/* Descripción */}
                        <FormInput
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />

                        {/* Subproductos */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="has_subproducts"
                                name="has_subproducts"
                                checked={formData.has_subproducts}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary-500 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <label htmlFor="has_subproducts" className="ml-2 text-sm font-medium">
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

                        {/* Mensaje de éxito */}
                        {showSuccess && (
                            <SuccessMessage
                                message="¡Producto actualizado exitosamente!"
                                onClose={() => setShowSuccess(false)}
                            />
                        )}
                    </form>
                </div>

                {/* Carousel / Detalle a la derecha */}
                {childrenWithProps && (
                    <div className="flex-1 bg-background-50 p-4 rounded overflow-y-auto max-h-[80vh]">
                        {childrenWithProps}
                    </div>
                )}
            </div>

            {/* Confirmación de borrado de archivo */}
            <DeleteMessage
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onDelete={confirmDelete}
                isDeleting={deleteStatus === "loading"}
                deleteError={deleteError}
                itemName="el archivo"
                itemIdentifier={fileToDelete?.filename || fileToDelete?.name || ""}
            />
        </Modal>
    )
}

EditProductModal.propTypes = {
    product: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    children: PropTypes.node,
}

export default EditProductModal
