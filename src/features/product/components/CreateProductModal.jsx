// src/features/product/components/CreateProductModal.jsx
import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { useQuery } from "@tanstack/react-query"

import Modal from "@/components/ui/Modal"
import FormInput from "@/components/ui/form/FormInput"
import FormSelect from "@/components/ui/form/FormSelect"
import FormStockInput from "@/features/product/components/FormStockInput"
import ErrorMessage from "@/components/common/ErrorMessage"
import SuccessMessage from "@/components/common/SuccessMessage"

import { listCategories } from "@/features/category/services/categories"
import { listTypes } from "@/features/type/services/types"

import { useProducts } from "@/features/product/hooks/useProductHooks"
import { useUploadProductFiles } from "@/features/product/hooks/useProductFileHooks"

const CreateProductModal = ({ isOpen, onClose, onSave }) => {
  // 1️⃣ Cargar categorías
  const {
    data: catPage = {},
    isLoading: loadingCategories,
  } = useQuery({
    queryKey: ["categories", { limit: 1000, status: true }],
    queryFn: () => listCategories({ limit: 1000, status: true }),

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  })
  const categories = catPage.results ?? []

  // 2️⃣ Estado del formulario
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
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 3️⃣ Cargar tipos según categoría
  const {
    data: typePage = {},
    isLoading: loadingTypes,
  } = useQuery({

    queryKey: [
      "types",
      { limit: 1000, status: true, category: formData.category },
    ],
    queryFn: () =>
      listTypes({ limit: 1000, status: true, category: formData.category }),
    enabled: !!formData.category,
    staleTime: 5 * 60 * 1000,

  })
  const types = typePage.results ?? []

  // 4️⃣ Productos (para validar código único y crear)
  const { products, createProduct } = useProducts({ status: true, page_size: 1000 })

  // 5️⃣ Hook de subida de archivos
  const {
    uploadFiles,
    uploading,
    uploadError,
    clearUploadError,
  } = useUploadProductFiles()

  // 6️⃣ Resetear al abrir modal
  useEffect(() => {
    if (!isOpen) return
    clearUploadError()
    setError("")
    setShowSuccess(false)
    setPreviewFiles([])
    setSubmitting(false)
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
      has_subproducts: false,
      images: [],
    })
  }, [isOpen, clearUploadError])

  // 7️⃣ Handlers
  const handleChange = useCallback((e) => {
    const { name, type, value, checked } = e.target
    setFormData((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }))
  }, [])
  const handleStockChange = (e) =>
    setFormData((f) => ({ ...f, initial_stock_quantity: e.target.value }))

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

  // 8️⃣ Validar código único
  const normalize = (txt) => txt.trim().toLowerCase().replace(/\s+/g, "")
  const validateCodeUnique = () => {
    const codeStr = normalize(formData.code)
    if (products.some((p) => p.code && normalize(String(p.code)) === codeStr)) {
      setError("El código ya está en uso por otro producto.")
      return false
    }
    return true
  }

  // 9️⃣ Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setShowSuccess(false)

    if (!validateCodeUnique()) return
    if (!formData.category) {
      setError("Selecciona una categoría.")
      return
    }

    // Armar FormData
    const payload = new FormData()
    payload.append("name", formData.name.trim())

    const codeNum = parseInt(formData.code, 10)
    if (isNaN(codeNum)) {
      setError("El código debe ser un número válido.")
      return
    }
    payload.append("code", codeNum.toString())
    payload.append("description", formData.description.trim())
    payload.append("brand", formData.brand.trim())
    payload.append("location", formData.location.trim())
    payload.append("position", formData.position.trim())
    payload.append("category", formData.category)
    if (formData.type) payload.append("type", formData.type)

    const stockVal = formData.initial_stock_quantity.replace(/[^0-9.]/g, "")
    if (stockVal && parseFloat(stockVal) > 0) {
      payload.append("initial_stock_quantity", stockVal)
    }
    payload.append("has_subproducts", formData.has_subproducts ? "true" : "false")

    try {
      setSubmitting(true)
      // Crear producto
      const newProd = await createProduct(payload)

      // Subir imágenes si las hay
      if (formData.images.length) {
        const ok = await uploadFiles({
          productId: newProd.id,
          files: formData.images,
        })
        if (!ok && uploadError) {
          setError(uploadError)
          return
        }
      }

      setShowSuccess(true)
      setTimeout(() => {
        onSave?.(newProd)
        onClose()
      }, 1500)
    } catch (err) {
      setError(err.message || "Error al crear el producto.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Producto">
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        {error && <ErrorMessage message={error} onClose={() => setError("")} />}
        {showSuccess && <SuccessMessage message="¡Producto creado exitosamente!" />}

        <FormSelect
          label="Categoría"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
          loading={loadingCategories}
          required
        />

        <FormSelect
          label="Tipo (opcional)"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={[
            { value: "", label: "N/A" },
            ...types.map((t) => ({ value: String(t.id), label: t.name })),
          ]}
          loading={loadingTypes}
          disabled={!formData.category || loadingTypes}
        />

        <FormInput label="Nombre / Medida" name="name" value={formData.name} onChange={handleChange} required />

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

        <div>
          <label className="block mb-2 text-sm">Archivos (máx. 5)</label>
          <div className="flex items-center space-x-4">
            <label htmlFor="images" className="cursor-pointer bg-info-500 text-white px-4 py-2 rounded hover:bg-info-600">
              Seleccionar archivos
            </label>
            <span className="text-sm">
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
                  <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-600">
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
            disabled={submitting}
            className="bg-neutral-500 text-white px-4 py-2 rounded hover:bg-neutral-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
          >
            {submitting || uploading ? "Guardando..." : "Crear Producto"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

CreateProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
}

export default CreateProductModal
