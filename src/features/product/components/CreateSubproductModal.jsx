// src/features/product/components/CreateSubproductModal.jsx
import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import Modal from "@/components/ui/Modal"
import FormInput from "@/components/ui/form/FormInput"
import FormSelect from "@/components/ui/form/FormSelect"
import ErrorMessage from "@/components/common/ErrorMessage"
import SuccessMessage from "@/components/common/SuccessMessage"

import { useCreateSubproduct } from "@/features/product/hooks/useSubproductHooks"
import { useUploadSubproductFiles } from "@/features/product/hooks/useSubproductFileHooks"

const locationOptions = [
    { value: "Deposito Principal", label: "Depósito Principal" },
    { value: "Deposito Secundario", label: "Depósito Secundario" },
]

const formTypeOptions = [
    { value: "Bobina", label: "Bobina" },
    { value: "Rollo", label: "Rollo" },
]

const initialState = {
    brand: "",
    number_coil: "",
    initial_enumeration: "",
    final_enumeration: "",
    gross_weight: "",
    net_weight: "",
    initial_stock_quantity: "",
    location: "Deposito Principal",
    form_type: "Bobina",
    observations: "",
    images: [],
}

const CreateSubproductModal = ({ product, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState(initialState)
    const [previewFiles, setPreviewFiles] = useState([])
    const [error, setError] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)

    // Hook para crear subproducto
    const createMut = useCreateSubproduct(product.id)
    // Hook para subir archivos de subproducto
    const uploadMut = useUploadSubproductFiles(product.id)

    // Reset al abrir/cerrar
    useEffect(() => {
        if (!isOpen) return
        setFormData(initialState)
        setPreviewFiles([])
        setError("")
        setShowSuccess(false)
        createMut.reset()
        uploadMut.reset()
    }, [isOpen, createMut, uploadMut])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (formData.images.length + files.length > 5) {
            setError("Máximo 5 archivos permitidos.")
            return
        }
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }))
        setPreviewFiles((prev) => [...prev, ...files.map((f) => f.name)])
    }

    const removeFile = (idx) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx),
        }))
        setPreviewFiles((prev) => prev.filter((_, i) => i !== idx))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setShowSuccess(false)

        // Validar número de stock
        const qtyStr = formData.initial_stock_quantity.trim()
        if (qtyStr && isNaN(parseFloat(qtyStr))) {
            setError("La cantidad de stock inicial no es válida.")
            return
        }

        // Armar FormData
        const fd = new FormData()
        Object.entries(formData).forEach(([key, val]) => {
            if (key === "images" || val === "" || val == null) return
            fd.append(key, key === "initial_stock_quantity" ? qtyStr : val)
        })

        try {
            // 1) Crear subproducto
            const newSub = await createMut.mutateAsync(fd)

            // 2) Subir imágenes si las hay
            if (formData.images.length) {
                await uploadMut.mutateAsync({
                    subproductId: newSub.id,
                    files: formData.images,
                })
            }

            // 3) Mostrar éxito y cerrar
            setShowSuccess(true)
            setTimeout(() => {
                onSave?.(newSub)
                onClose()
            }, 1000)
        } catch (err) {
            setError(err.message || "No se pudo crear el subproducto.")
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Subproducto">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <ErrorMessage message={error} onClose={() => setError("")} />}
                {showSuccess && <SuccessMessage message="¡Subproducto creado con éxito!" />}

                <FormSelect
                    label="Tipo de Forma"
                    name="form_type"
                    value={formData.form_type}
                    onChange={handleChange}
                    options={formTypeOptions}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Marca"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Número de Bobina"
                        name="number_coil"
                        value={formData.number_coil}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Enumeración Inicial"
                        name="initial_enumeration"
                        value={formData.initial_enumeration}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Enumeración Final"
                        name="final_enumeration"
                        value={formData.final_enumeration}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Peso Bruto (kg)"
                        name="gross_weight"
                        value={formData.gross_weight}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Peso Neto (kg)"
                        name="net_weight"
                        value={formData.net_weight}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                        label="Stock Inicial"
                        name="initial_stock_quantity"
                        value={formData.initial_stock_quantity}
                        onChange={handleChange}
                    />
                    <FormSelect
                        label="Ubicación"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        options={locationOptions}
                        required
                    />
                </div>

                <FormInput
                    label="Observaciones"
                    name="observations"
                    value={formData.observations}
                    onChange={handleChange}
                    textarea
                />

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

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={createMut.isLoading || uploadMut.isLoading}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={createMut.isLoading || uploadMut.isLoading}
                        className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 ${createMut.isLoading || uploadMut.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {(createMut.isLoading || uploadMut.isLoading) ? "Guardando..." : "Crear Subproducto"}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

CreateSubproductModal.propTypes = {
    product: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func,
}

export default CreateSubproductModal
