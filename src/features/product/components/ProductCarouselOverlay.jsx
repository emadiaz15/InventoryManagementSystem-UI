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
                 bg-white shadow-2xl z-[9999] rounded-lg border border-gray-300 overflow-hidden"
        >
            {/* Botón de cierre */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-700 hover:text-black text-xl font-bold z-10"
            >
                ✕
            </button>

            {/* Imagen actual */}
            <div className="relative w-full pt-[66%] bg-black">
                {carouselImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                            }`}
                    >
                        <img
                            src={img}
                            onClick={() => window.open(img, "_blank")}
                            className="w-full h-full object-contain cursor-pointer"
                            alt={`Slide ${index + 1}`}
                        />
                    </div>
                ))}

                {/* Flechas */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white z-20"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 p-2 rounded-full shadow hover:bg-white z-20"
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
                        className={`w-3 h-3 mx-1 rounded-full ${index === current ? "bg-blue-500" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCarouselOverlay;
