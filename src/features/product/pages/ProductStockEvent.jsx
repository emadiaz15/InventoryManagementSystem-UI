import React, { useState, useEffect, useCallback } from 'react';
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
import Spinner from '../../../components/ui/Spinner';
import { listStockProductEvents } from '../services/products/listStockProductEvents';

const mockEvents = [
    {
        date: '2025-03-01',
        type: 'Ingreso',
        quantity: 100,
        description: 'Compra de proveedor',
        cutting_order_id: 'OC-001',
        order_id: 'PED-1001',
        user: 'admin',
    },
    {
        date: '2025-03-05',
        type: 'Egreso',
        quantity: -30,
        description: 'Pedido cliente',
        cutting_order_id: 'OC-002',
        order_id: 'PED-1002',
        user: 'juanperez',
    },
    {
        date: '2025-03-10',
        type: 'Ajuste',
        quantity: -5,
        description: 'Stock dañado',
        cutting_order_id: 'OC-003',
        order_id: null,
        user: 'admin',
    },
];

const ProductStockEvent = () => {
    const { productId } = useParams();
    const [stockEvents, setStockEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);

    const fetchStockEvents = useCallback(async (
        url = `/api/v1/stocks/products/${productId}/stock/events/`
    ) => {
        setLoading(true);
        try {
            const data = await listStockProductEvents(url, startDate, endDate);
            setStockEvents(data.results || []);
            setNextPage(data.next);
            setPreviousPage(data.previous);
            setError(null);
        } catch (err) {
            setError('Error al obtener los eventos de stock.');
            setStockEvents(mockEvents);
        } finally {
            setLoading(false);
            setInitialLoaded(true);
        }
    }, [productId, startDate, endDate]);

    useEffect(() => {
        if (productId) fetchStockEvents();
    }, [productId, fetchStockEvents]);

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
        <Layout isLoading={loading}>
            <div className="flex-1 p-2 mt-14">
                <Toolbar title="Historial de Stock" buttonText="Modificar Stock" />
                <DateFilter onFilterChange={handleFilterChange} />

                {error && (
                    <div className="text-yellow-500 text-center mt-4">
                        {error} - Mostrando datos simulados.
                    </div>
                )}

                {loading ? (
                    <div className="my-8 flex justify-center items-center min-h-[30vh]">
                        <Spinner size="6" color="text-primary-500" />
                    </div>
                ) : (
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
                )}

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

export default ProductStockEvent;
