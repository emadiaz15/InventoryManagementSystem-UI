import React, { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/form/FormInput";
import FormSelect from "../../../components/ui/form/FormSelect";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ErrorMessage from "../../../components/common/ErrorMessage";
import { updateSubproduct } from "../services/updateSubproduct";

const EditSubproductModal = ({ isOpen, onClose, onSave, subproduct }) => {
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
        form_type: "Bobina",
        initial_stock_location: "Deposito Principal",
        technical_sheet_photo: null,
    });

    useEffect(() => {
        if (subproduct) {
            setFormData({
                brand: subproduct.brand || "",
                number_coil: subproduct.number_coil || "",
                initial_length: subproduct.initial_length || "",
                final_length: subproduct.final_length || "",
                total_weight: subproduct.total_weight || "",
                coil_weight: subproduct.coil_weight || "",
                form_type: subproduct.form_type || "Bobina",
                initial_stock_location: subproduct.initial_stock_location || "Deposito Principal",
                technical_sheet_photo: null,
            });
        }
    }, [subproduct]);

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;
        const newValue = type === "file" ? files[0] : value;
        setFormData(prev => ({
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
            if (formData[key] !== null && formData[key] !== undefined) {
                dataToSend.append(key, formData[key]);
            }
        }

        try {
            await updateSubproduct(subproduct.parent, subproduct.id, dataToSend);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onSave();
                onClose();
            }, 2000);
        } catch (error) {
            setError("No se pudo actualizar el subproducto.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Subproducto">
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
                    <div className="flex-1">
                        <FormInput label="Enumeración Inicial" name="initial_length" value={formData.initial_length} onChange={handleChange} />
                    </div>
                    <div className="flex-1">
                        <FormInput label="Enumeración Final" name="final_length" value={formData.final_length} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <FormInput label="Peso Neto (kg)" name="total_weight" value={formData.total_weight} onChange={handleChange} />
                    </div>
                    <div className="flex-1">
                        <FormInput label="Peso Bruto (kg)" name="coil_weight" value={formData.coil_weight} onChange={handleChange} />
                    </div>
                </div>

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
                    <button type="button" onClick={onClose} className="bg-neutral-500 text-white py-2 px-4 rounded hover:bg-neutral-600 transition-colors">
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Actualizar Subproducto"}
                    </button>
                </div>
            </form>

            {showSuccess && <SuccessMessage message="¡Subproducto actualizado con éxito!" onClose={() => setShowSuccess(false)} />}
        </Modal>
    );
};

export default EditSubproductModal;
