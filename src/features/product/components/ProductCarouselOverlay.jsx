// src/features/product/components/ProductCarouselOverlay.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
    TrashIcon,
    DocumentIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import Spinner from "@/components/ui/Spinner";
import PropTypes from "prop-types";
import { downloadProductFile } from "@/features/product/services/products/files"; // <-- import

const ProductCarouselOverlay = ({
    images = [],
    productId,
    onClose,
    onDeleteRequest,
    editable = false,
    isEmbedded = false,
}) => {
    const [current, setCurrent] = useState(0);
    const [localImages, setLocalImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgLoaded, setImgLoaded] = useState(false);

    const getMediaType = (type = "", filename = "") => {
        const ext = filename.toLowerCase().split(".").pop();
        if (type === "application/pdf" || ext === "pdf") return "pdf";
        if (
            type.startsWith("video/") ||
            ["mp4", "webm", "mov", "avi", "mkv", "mpeg"].includes(ext)
        )
            return "video";
        if (
            type.startsWith("image/") ||
            ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)
        )
            return "image";
        return "unknown";
    };

    const nextSlide = useCallback(() => {
        setImgLoaded(false);
        setCurrent((i) => (i + 1) % localImages.length);
    }, [localImages.length]);

    const prevSlide = useCallback(() => {
        setImgLoaded(false);
        setCurrent((i) => (i - 1 + localImages.length) % localImages.length);
    }, [localImages.length]);

    useEffect(() => {
        if (!images?.length) {
            setLocalImages([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const formatted = images
            .map((img) => ({
                id: img.drive_file_id || img.id,
                filename: img.filename || img.name || img.id,
                contentType: img.contentType || img.mimeType || "application/octet-stream",
                url: img.url, // sigue siendo URL presignada para abrir en nueva pestaña
            }))
            .filter((i) => i.url);
        setLocalImages(formatted);
        setCurrent(0);
        setLoading(false);
    }, [images]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") nextSlide();
            else if (e.key === "ArrowLeft") prevSlide();
            else if (e.key === "Escape" && !isEmbedded) onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [nextSlide, prevSlide, isEmbedded, onClose]);

    useEffect(() => {
        const idx = Math.min(current, localImages.length - 1);
        const item = localImages[idx];
        if (!item) return;
        if (getMediaType(item.contentType, item.filename) === "image") {
            const img = new Image();
            img.src = item.url;
            if (img.complete) setImgLoaded(true);
        }
    }, [current, localImages]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="8" color="text-primary-500" />
            </div>
        );
    }
    if (!localImages.length) {
        return (
            <div className="p-6 text-center text-sm text-gray-600">
                No hay archivos multimedia.
            </div>
        );
    }

    const idx = Math.min(current, localImages.length - 1);
    const item = localImages[idx];
    const mediaType = getMediaType(item.contentType, item.filename);

    return (
        <div className="w-full">
            <div className="relative w-full pt-[66%] bg-black rounded overflow-hidden mb-4">
                {/* Contenido multimedia */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {!imgLoaded && mediaType === "image" && (
                        <Spinner size="6" color="text-white" />
                    )}

                    {mediaType === "video" && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full"
                        >
                            <video
                                src={item.url}
                                controls
                                className="w-full h-full object-contain"
                                onCanPlay={() => setImgLoaded(true)}
                            />
                        </a>
                    )}

                    {mediaType === "pdf" && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded"
                        >
                            <DocumentIcon className="w-12 h-12 text-red-600" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                                {item.filename}
                            </span>
                        </a>
                    )}

                    {mediaType === "image" && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full block"
                        >
                            <img
                                src={item.url}
                                onLoad={() => setImgLoaded(true)}
                                className={`w-full h-full object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"
                                    }`}
                                alt={item.filename}
                            />
                        </a>
                    )}

                    {mediaType === "unknown" && (
                        <div className="text-white text-sm">Tipo no soportado</div>
                    )}
                </div>

                {/* Navegación */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
                >
                    ▶
                </button>

                {/* Eliminar */}
                {editable && (
                    <button
                        onClick={() => onDeleteRequest?.(item)}
                        className="absolute bottom-2 right-2 bg-red-600 p-2 rounded-full text-white hover:bg-red-700"
                        title="Eliminar archivo"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Indicadores */}
            <div className="flex justify-center py-2 border-t border-gray-200 bg-gray-50 rounded">
                {localImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setImgLoaded(false);
                            setCurrent(i);
                        }}
                        className={`w-3 h-3 mx-1 rounded-full ${i === idx ? "bg-blue-500" : "bg-gray-400"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

ProductCarouselOverlay.propTypes = {
    images: PropTypes.array,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
    onDeleteRequest: PropTypes.func,
    editable: PropTypes.bool,
    isEmbedded: PropTypes.bool,
};

export default ProductCarouselOverlay;
