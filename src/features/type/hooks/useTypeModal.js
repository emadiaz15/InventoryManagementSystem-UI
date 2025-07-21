// src/features/type/hooks/useTypeModal.js
import { useState, useCallback } from "react"

/**
 * Hook para controlar abrir/cerrar modales de Tipo.
 * modalState.type → "create" | "edit" | "view" | "deleteConfirm" | null
 * modalState.typeData → datos del tipo seleccionada
 */
const useTypeModal = () => {
  const [modalState, setModalState] = useState({
    type: null,
    typeData: null
  })

  const openModal = useCallback((mode, data = null) => {
    setModalState({ type: mode, typeData: data })
  }, [])

  const closeModal = useCallback(() => {
    setModalState({ type: null, typeData: null })
  }, [])

  return { modalState, openModal, closeModal }
}

export default useTypeModal
