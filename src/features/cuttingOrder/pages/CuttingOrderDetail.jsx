// src/pages/CuttingOrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CuttingOrderDetail = () => {
  const { id } = useParams(); // Obtener el ID de la URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener los detalles de la orden
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`/api/v1/cutting-orders/${id}`); // Ajusta la URL según tu API
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los detalles de la orden');
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) {
    return <p>Cargando detalles de la orden...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1>Detalles de la Orden de Corte #{order.id}</h1>
      <p><strong>Cliente:</strong> {order.customer}</p>
      <p><strong>Cantidad de Corte:</strong> {order.cutting_quantity}</p>
      <p><strong>Producto:</strong> {order.product_name}</p>
      <p><strong>Estado:</strong> {order.status}</p>
      {/* Agrega más detalles aquí según los datos disponibles en la API */}
    </div>
  );
};

export default CuttingOrderDetail;
