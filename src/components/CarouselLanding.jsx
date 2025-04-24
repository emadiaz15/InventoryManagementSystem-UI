import React, { useState, useEffect } from 'react';

const images = [
    {
        src: '/images/inventario.jpg',
        title: 'Inventario en Tiempo Real',
        description: 'Monitoreá el estado de tu stock en tiempo real con precisión y control total.'
    },
    {
        src: '/images/ordenes.jpg',
        title: 'Órdenes de Corte Eficientes',
        description: 'Organizá y visualizá las órdenes con flujos optimizados para cada etapa.'
    },
    {
        src: '/images/usuarios.jpg',
        title: 'Gestión de Usuarios y Roles',
        description: 'Asigná permisos según responsabilidades y mantené el control del sistema.'
    },
    {
        src: '/images/reportes.jpg',
        title: 'Reportes y Estadísticas',
        description: 'Accedé a insights del depósito para tomar decisiones basadas en datos.'
    },
];

const Carousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-4xl shadow-md">
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className={`transition-opacity duration-1000 ease-in-out absolute inset-0 w-full h-full ${idx === current ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}
                >
                    <img src={img.src} alt={img.title} className="w-full h-96 object-cover rounded-4xl" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background-200 to-transparent p-6 rounded-b-4xl">
                        <h3 className="text-white text-xl font-bold drop-shadow-md">{img.title}</h3>
                        <p className="text-text-white text-sm drop-shadow-md mt-1">{img.description}</p>
                    </div>
                </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${current === idx ? 'bg-white' : 'bg-white/40'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
