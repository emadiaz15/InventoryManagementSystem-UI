import React, { useState, useEffect, useMemo, useCallback } from "react"
import Modal from "@/components/ui/Modal"
import ErrorMessage from "@/components/common/ErrorMessage"
import FormInput from "@/components/ui/form/FormInput"

const TypeCreateModal = ({
  isOpen,
  onClose,
  onCreateType,
  categories,
  loadingCategories
}) => {
  const initial = useMemo(() => ({ name: "", description: "", category: "" }), [])
  const [formData, setFormData] = useState(initial)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(initial)
      setError("")
      setSaving(false)
    }
  }, [isOpen, initial])

  // Opciones legibles para autocompletado
  const categoryOptions = useMemo(() => categories.map((c) => ({
    id: c.id,
    name: c.name
  })), [categories])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((f) => ({ ...f, [name]: value }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const selectedCategory = categoryOptions.find(c => c.name === formData.category)
    const errs = {}
    if (!formData.name.trim()) errs.name = "El nombre es obligatorio."
    if (!selectedCategory) errs.category = "La categoría es obligatoria o inválida."
    if (Object.keys(errs).length) return setError(Object.values(errs).join(" "))

    setSaving(true)
    try {
      await onCreateType({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: selectedCategory.id
      })
      onClose()
    } catch (err) {
      setError(err.message || "Error al crear el tipo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Tipo" position="center">
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}
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
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">
            Categoría
          </label>
          <input
            type="text"
            name="category"
            id="category"
            list="category-options"
            value={formData.category}
            onChange={handleChange}
            disabled={saving || loadingCategories}
            placeholder="Seleccione o escriba una categoría"
            className={`block w-full border ${error.includes("categoría") ? "border-red-500" : "border-gray-300"} bg-white text-text-primary rounded-md shadow-sm p-2 focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
            required
          />
          <datalist id="category-options">
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.name} />
            ))}
          </datalist>
          {error.includes("categoría") && (
            <p className="mt-1 text-sm text-red-600">
              La categoría no existe. Por favor, créala primero antes de continuar.
            </p>
          )}
        </div>
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
            {saving ? "Guardando..." : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TypeCreateModal
