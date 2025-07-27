// src/features/category/hooks/useCategoryFormState.js
import { useState, useCallback } from "react";

export const useCategoryFormState = (initial = { name: "", description: "" }) => {
  const [formData, setFormData] = useState(initial);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const validate = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = ["Este campo es requerido"];
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData(initial);
    setValidationErrors({});
  };

  return { formData, setFormData, handleChange, resetForm, validate, validationErrors };
};
