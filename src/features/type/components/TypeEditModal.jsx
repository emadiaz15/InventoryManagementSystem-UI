// src/features/type/components/TypeEditModal.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react"
import Modal from "@/components/ui/Modal"
import ErrorMessage from "@/components/common/ErrorMessage"
import SuccessMessage from "@/components/common/SuccessMessage"
import FormInput from "@/components/ui/form/FormInput"
import FormSelect from "@/components/ui/form/FormSelect"

const TypeEditModal = ({
    type,
    isOpen,
    onClose,
    onUpdateType,
    categories,
    loadingCategories
}) => {
    const initial = useMemo(
        () => ({
            name: type?.name || "",
            description: type?.description || "",
            category: type?.category?.toString() || ""
        }),
        [type]
    )

    const [formData, setFormData] = useState(initial)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setFormData(initial)
            setError("")
            setSuccess("")
            setSaving(false)
        }
    }, [isOpen, initial])

    const categoryOptions = useMemo(
        () => categories.map((c) => ({ value: c.id.toString(), label: c.name })),
        [categories]
    )

    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData((f) => ({ ...f, [name]: value }))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const errs = {}
        if (!formData.name.trim()) errs.name = "El nombre es obligatorio."
        if (!formData.category) errs.category = "La categoría es obligatoria."
        if (Object.keys(errs).length) return setError(Object.values(errs).join(" "))

        setSaving(true)
        try {
            const updated = await onUpdateType(type.id, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: parseInt(formData.category, 10)
            })
            setSuccess(`Tipo "${updated.name}" actualizado.`)
            setTimeout(() => {
                setSuccess("")
                onClose()
            }, 2000)
        } catch (err) {
            setError(err.message || "Error al actualizar el tipo.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Tipo">
            {error && <ErrorMessage message={error} onClose={() => setError("")} />}
            {success && <SuccessMessage message={success} />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={saving}
                />
                <FormInput
                    label="Descripción"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={saving}
                />
                <FormSelect
                    label="Categoría"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categoryOptions}
                    required
                    loading={loadingCategories}
                    disabled={saving || loadingCategories}
                />
                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={saving || loadingCategories}
                        className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default TypeEditModal
