import { useState, useCallback } from "react";

const useTypeModal = () => {
  const [modalState, setModalState] = useState({ type: null, typeData: null });

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, typeData: data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, typeData: null });
  }, []);

  return {
    modalState,
    openModal,
    closeModal,
  };
};

export default useTypeModal;