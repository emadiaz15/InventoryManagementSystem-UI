import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    KeyIcon,
    EyeIcon,
} from '@heroicons/react/24/solid';
import Toolbar from '../../../components/common/Toolbar';
import Table from '../../../components/common/Table';
import Pagination from '../../../components/ui/Pagination';
import DateFilter from '../../../components/common/DateFilter';
import Layout from '../../../pages/Layout';
import { listStockSubproductEvents } from '../services/listStockSubproductEvents';

const mockSubproductEvents = [
    {
        date: '2025-03-01',
        type: 'Ingreso',
        quantity: 50,
        description: 'Recepción de subproducto',
        cutting_order_id: 'OC-101',
        order_id: 'PED-2001',
        user: 'operador1',
    },
    {
        date: '2025-03-07',
        type: 'Egreso',
        quantity: -20,
        description: 'Envío a cliente',
        cutting_order_id: 'OC-102',
        order_id: 'PED-2002',
        user: 'maria',
    },
    {
        date: '2025-03-15',
        type: 'Ajuste',
        quantity: -3,
        description: 'Corrección de inventario',
        cutting_order_id: 'OC-103',
        order_id: null,
        user: 'admin',
    },
];

const SubproductStockEvent = () => {
    const { subproductId } = useParams();
    const [stockEvents, setStockEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const fetchStockEvents = async (url = `/api/v1/stocks/subproducts/${subproductId}/stock/events/`) => {
        setLoading(true);
        try {
            const data = await listStockSubproductEvents(url, startDate, endDate);
            setStockEvents(data.results || []);
            setNextPage(data.next);
            setPreviousPage(data.previous);
            setError(null);
        } catch (err) {
            setError('Error al obtener los eventos de stock.');
            setStockEvents(mockSubproductEvents);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockEvents();
    }, [startDate, endDate]);

    const handleFilterChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const getStyledBadge = (type, value, isQuantity = false) => {
        const base = 'px-2 py-1 rounded text-sm font-semibold inline-flex items-center gap-1';
        let icon = null, colorClass = '', sign = '', absValue = Math.abs(value);

        if (type === 'Ingreso') {
            icon = <ArrowDownIcon className="h-4 w-4" />;
            colorClass = 'bg-green-500';
            sign = '+';
        } else if (type === 'Egreso') {
            icon = <ArrowUpIcon className="h-4 w-4" />;
            colorClass = 'bg-red-500';
            sign = '-';
        } else if (type === 'Ajuste') {
            icon = <KeyIcon className="h-4 w-4" />;
            colorClass = 'bg-blue-500';
            sign = value >= 0 ? '+' : '-';
        } else {
            return <span>{value}</span>;
        }

        return (
            <span className={`${base} ${colorClass} text-white`}>
                {icon}
                {isQuantity ? `${sign}${absValue}` : value}
            </span>
        );
    };

    let currentStock = 0;
    const orderedEvents = [...stockEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

    const rows = [...orderedEvents].reverse().map((event) => {
        currentStock += event.quantity;

        return {
            Fecha: new Date(event.date).toLocaleDateString(),
            Tipo: getStyledBadge(event.type, event.type),
            Cantidad: getStyledBadge(event.type, event.quantity, true),
            'Nro Orden de Corte': (
                <div className="flex items-center gap-2">
                    <span>{event.cutting_order_id || 'N/A'}</span>
                    <button
                        className="bg-blue-500 p-2 rounded hover:bg-blue-600 transition-colors"
                        title="Ver orden de corte"
                        onClick={() => console.log('Ver OC', event.cutting_order_id)}
                    >
                        <EyeIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
            ),
            'Nro de Pedido': event.order_id || 'N/A',
            Usuario: event.user || 'N/A',
            Descripción: event.description,
            'Stock Resultante': (
                <span className="text-gray-700 font-extrabold">{currentStock}</span>
            ),
        };
    });

    return (
        <Layout>
            <div className="flex-1 p-2 mt-14">
                <Toolbar title="Historial de Stock del Subproducto" />
                <DateFilter onFilterChange={handleFilterChange} />
                {error && (
                    <div className="text-yellow-500 text-center mt-4">
                        {error} - Mostrando datos simulados.
                    </div>
                )}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex-1 mt-2">
                    <Table
                        headers={[
                            'Fecha',
                            'Tipo',
                            'Cantidad',
                            'Nro Orden de Corte',
                            'Nro de Pedido',
                            'Usuario',
                            'Descripción',
                            'Stock Resultante',
                        ]}
                        rows={rows}
                        columnClasses={[
                            'w-28', // Fecha
                            'w-28', // Tipo
                            'w-28', // Cantidad
                            'w-44', // Nro OC
                            'w-40', // Nro Pedido
                            'w-32', // Usuario
                            'w-72', // Descripción
                            'w-32', // Stock
                        ]}
                    />
                </div>
                <Pagination
                    onNext={() => nextPage && fetchStockEvents(nextPage)}
                    onPrevious={() => previousPage && fetchStockEvents(previousPage)}
                    hasNext={Boolean(nextPage)}
                    hasPrevious={Boolean(previousPage)}
                />
            </div>
        </Layout>
    );
};

export default SubproductStockEvent;
