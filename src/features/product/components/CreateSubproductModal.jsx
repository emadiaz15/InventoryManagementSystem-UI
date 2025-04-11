import React, { useState } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { createSubproduct } from "../services/createSubproducts";

const CreateSubproductModal = ({ isOpen, onClose, onSave, product }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        brand: "",
        number_coil: "",
        initial_length: "",
        final_length: "",
        total_weight: "",
        coil_weight: "",
        initial_stock_quantity: "",
        initial_stock_location: "Deposito Principal",
        technical_sheet_photo: null,
        form_type: "Bobina",
        parent: product?.id || null,
    });

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        const newValue = type === "file" ? files[0] : value;
        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const dataToSend = new FormData();

        for (const key in formData) {
            let value = formData[key];
            if (value !== null && value !== undefined) {
                if (key === "initial_stock_quantity") {
                    let stockValue = String(value).replace(/[^0-9.]/g, "").trim();
                    if (stockValue && parseFloat(stockValue) > 0) {
                        dataToSend.set("initial_stock_quantity", stockValue);
                    }
                } else {
                    dataToSend.set(key, value);
                }
            }
        }

        try {
            await createSubproduct(product.id, dataToSend);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error al crear subproducto:", error);
            const backendError = error?.response?.data?.initial_stock_quantity || error.message;
            setError(typeof backendError === "string" ? backendError : "No se pudo guardar el subproducto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Agregar Subproducto">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {error && <ErrorMessage message={error} />}

                <FormSelect
                    name="form_type"
                    value={formData.form_type}
                    onChange={handleChange}
                    options={[
                        { value: "Bobina", label: "Bobina" },
                        { value: "Rollo", label: "Rollo" },
                    ]}
                    required
                />

                <FormInput label="Marca" name="brand" value={formData.brand} onChange={handleChange} />
                <FormInput label="Número de Bobina" name="number_coil" value={formData.number_coil} onChange={handleChange} />

                <div className="flex gap-4">
                    <FormInput label="Enumeración Inicial" name="initial_length" value={formData.initial_length} onChange={handleChange} />
                    <FormInput label="Enumeración Final" name="final_length" value={formData.final_length} onChange={handleChange} />
                </div>

                <div className="flex gap-4">
                    <FormInput label="Peso Neto (kg)" name="total_weight" value={formData.total_weight} onChange={handleChange} />
                    <FormInput label="Peso Bruto (kg)" name="coil_weight" value={formData.coil_weight} onChange={handleChange} />
                </div>

                <FormInput
                    label="Cantidad de Stock Inicial"
                    name="initial_stock_quantity"
                    type="number"
                    value={formData.initial_stock_quantity}
                    onChange={handleChange}
                />

                <FormSelect
                    name="initial_stock_location"
                    value={formData.initial_stock_location}
                    onChange={handleChange}
                    options={[
                        { value: "Deposito Principal", label: "Depósito Principal" },
                        { value: "Deposito Secundario", label: "Depósito Secundario" },
                    ]}
                    required
                />

                <FormInput label="Ficha Técnica (Imagen)" name="technical_sheet_photo" type="file" onChange={handleChange} />

                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Subproducto"}
                    </button>
                </div>
            </form>

            {showSuccess && <SuccessMessage message="¡Subproducto guardado con éxito!" onClose={() => setShowSuccess(false)} />}
        </Modal>
    );
};

export default CreateSubproductModal;
