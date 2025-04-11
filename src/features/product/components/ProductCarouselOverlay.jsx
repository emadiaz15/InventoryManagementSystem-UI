import React, { useState } from "react";

const ProductCarouselOverlay = ({ images, onClose }) => {
    const defaultImages = ["/product-images.jpg", "/product-images1.jpg"];
    const carouselImages = Array.isArray(images) && images.length > 0 ? images : defaultImages;
    const [current, setCurrent] = useState(0);
    const length = carouselImages.length;

    const nextSlide = () => {
        setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));
    };

    return (
        <div
            className="fixed top-1/2 right-4 transform -translate-y-1/2 
                       w-[40vw] max-w-[680px] h-auto 
                       bg-background-100 text-text-primary shadow-2xl z-[9999] rounded-lg 
                       border border-neutral-500 overflow-hidden"
        >
            {/* Botón de cierre estilo Modal */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-text-secondary hover:text-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-400 rounded-full p-1 z-50"
                aria-label="Cerrar carrusel"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Imagen actual */}
            <div className="relative w-full pt-[66%] bg-black">
                {carouselImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                    >
                        <img
                            src={img}
                            onClick={() => window.open(img, "_blank")}
                            className="w-full h-full object-contain cursor-pointer"
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}

                {/* Flechas navegación */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background-200 p-2 rounded-full shadow hover:bg-white z-20"
                    aria-label="Anterior"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background-200 p-2 rounded-full shadow hover:bg-white z-20"
                    aria-label="Siguiente"
                >
                    ▶
                </button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center items-center py-3 bg-white z-20">
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 mx-1 rounded-full ${index === current ? "bg-primary-500" : "bg-neutral-500"}`}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarouselOverlay;
