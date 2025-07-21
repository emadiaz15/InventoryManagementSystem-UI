// src/features/type/hooks/useTypeForm.js
import { useState } from "react"
import { useTypes } from "./useTypes"

/**
 * Hook para el formulario de creación de Tipo.
 * @param {Function} onClose Callback que cierra el modal y recibe el nuevo tipo.
 */
const useTypeForm = (onClose) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: ""
  })
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const { createType, status } = useTypes()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const nuevo = await createType(formData)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose(nuevo)
      }, 2000)
    } catch (err) {
      setError(
        err.message.includes("unique")
          ? "El nombre ya existe. Debe ser único."
          : "Error al crear el tipo. Inténtalo de nuevo."
      )
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", category: "" })
    setError("")
    setShowSuccess(false)
  }

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    error,
    showSuccess,
    isSubmitting: status.create === "loading"
  }
}

export default useTypeForm
