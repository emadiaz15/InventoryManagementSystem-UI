import React, { useState, forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { CalendarIcon } from '@heroicons/react/24/solid';
import FormInput from '../ui/form/FormInput';

// Registramos español
registerLocale('es', es);

const CustomInput = forwardRef(({ value, onClick, label }, ref) => (
    <div className="relative w-32 md:w-40 flex items-center">
        <FormInput
            label={label}
            name={label.replace(/\s+/g, '').toLowerCase()}
            type="text"
            value={value}
            onChange={() => { }}
            placeholder=""
            readOnly
            ref={ref}
        />
        <CalendarIcon
            onClick={onClick}
            className="w-5 h-5 absolute top-[38px] right-3 text-text-secondary cursor-pointer"
        />
    </div>
));

const DateFilter = ({ onFilterChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        onFilterChange(startDate, endDate);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 pl-5 flex items-end space-x-8">
            <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                customInput={<CustomInput label="Fecha Inicio" />}
                locale="es"
                dateFormat="dd/MM/yyyy"
                selectsStart
                startDate={startDate}
                endDate={endDate}
            />

            <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                customInput={<CustomInput label="Fecha Fin" />}
                locale="es"
                dateFormat="dd/MM/yyyy"
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
            />

            <button
                type="submit"
                className="bg-primary-500 text-text-white hover:bg-primary-600 px-4 mb-4 py-2 rounded-md transition-colors"
            >
                Buscar
            </button>
        </form>
    );
};

export default DateFilter;
