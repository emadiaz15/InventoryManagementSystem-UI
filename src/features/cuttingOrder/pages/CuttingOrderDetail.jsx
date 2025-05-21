import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../pages/Layout';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const CuttingOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`/api/v1/cutting-orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError('Error al cargar los detalles de la orden.');
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    };

    fetchOrderDetail();
  }, [id]);

  return (
    <Layout isLoading={!initialLoaded}>
      <div className="px-4 pb-4 pt-8 md:px-6 md:pb-6 md:pt-12 min-h-[40vh]">
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Detalles de la Orden de Corte
        </h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="8" color="text-primary-500" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <strong>ID:</strong> {order.id}
            </div>
            <div>
              <strong>Cliente:</strong> {order.customer}
            </div>
            <div>
              <strong>Producto:</strong> {order.product_name}
            </div>
            <div>
              <strong>Cantidad de Corte:</strong> {order.cutting_quantity}
            </div>
            <div>
              <strong>Estado:</strong> {order.status}
            </div>
            {/* Agrega más campos según tu modelo */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CuttingOrderDetail;
