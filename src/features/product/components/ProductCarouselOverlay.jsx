import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { fetchProtectedFile } from "../../../services/mediaService";
import Spinner from "../../../components/ui/Spinner";
import PropTypes from "prop-types";

/**
 * Overlay de carousel para mostrar archivos multimedia de un producto.
 * En modo editable, delega la eliminación al handler onDeleteRequest.
 */
const ProductCarouselOverlay = ({
    images = [],
    productId,
    onClose,
    onDeleteSuccess,
    onDeleteRequest,
    source = "fastapi",
    editable = false,
    isEmbedded = false,
}) => {
    const [current, setCurrent] = useState(0);
    const [localImages, setLocalImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadError, setDownloadError] = useState(null);
    const isPDF = (type) => type === "application/pdf";

    useEffect(() => {
        setCurrent(0);
        setLocalImages([]);
        setDownloadError(null);
        setLoading(true);

        const preload = async () => {
            try {
                const enriched = await Promise.all(
                    images.map(async (img) => {
                        const fileId = img.drive_file_id || img.id;
                        const url = img.url || await fetchProtectedFile(productId, fileId, source);
                        return { ...img, id: fileId, url };
                    })
                );
                setLocalImages(enriched.filter((img) => img.url));
            } catch (error) {
                console.error("❌ Error cargando archivos:", error);
                setDownloadError("Error al cargar archivos multimedia.");
            } finally {
                setLoading(false);
            }
        };

        if (Array.isArray(images) && images.length > 0) preload();
    }, [images, productId, source]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "ArrowRight") nextSlide();
            else if (e.key === "ArrowLeft") prevSlide();
            else if (e.key === "Escape" && !isEmbedded) onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [current, localImages]);

    const isVideo = (type) => type?.startsWith("video/");
    const nextSlide = () => setCurrent((i) => (i + 1) % localImages.length);
    const prevSlide = () => setCurrent((i) => (i - 1 + localImages.length) % localImages.length);
    const handleClickImage = (url) => url && window.open(url, "_blank");

    // Delegar eliminación al padre
    const handleDelete = () => {
        const file = localImages[current];
        if (file && typeof onDeleteRequest === "function") {
            onDeleteRequest(file);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 h-full">
                <Spinner size="8" color="text-primary-500" />
                <p className="mt-4 text-sm text-gray-500">Cargando archivos multimedia...</p>
            </div>
        );
    }

    if (!localImages.length) {
        return (
            <div className="p-6 text-center text-sm text-gray-600">
                No se encontraron archivos multimedia.
            </div>
        );
    }

    const currentItem = localImages[current];

    return (
        <>
            <div className="relative w-full pt-[66%] bg-black rounded overflow-hidden mb-4">
                <div className="absolute top-0 left-0 w-full h-full z-10">
                    {isVideo(currentItem.contentType) ? (
                        <video
                            src={currentItem.url}
                            controls
                            className="w-full h-full object-contain"
                            title={currentItem.filename}
                        />
                    ) : isPDF(currentItem.contentType) ? (
                        <div className="flex items-center justify-center w-full h-full bg-gray-100">
                            <button
                                onClick={() => handleClickImage(currentItem.url)}
                                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors"
                            >
                                Ver PDF: {currentItem.filename}
                            </button>
                        </div>
                    ) : (
                        <img
                            src={currentItem.url}
                            onClick={() => handleClickImage(currentItem.url)}
                            className="w-full h-full object-contain cursor-pointer"
                            alt={currentItem.filename || "archivo"}
                            title={currentItem.filename}
                        />
                    )}
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-20"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-20"
                >
                    ▶
                </button>

                {editable && (
                    <button
                        onClick={handleDelete}
                        className="absolute bottom-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 z-20 transition-colors"
                        title="Eliminar archivo"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex justify-center py-2 border-t border-gray-200 bg-gray-50 rounded">
                {localImages.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 mx-1 rounded-full ${idx === current ? "bg-blue-500" : "bg-gray-400"}`}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>

            {downloadError && (
                <div className="text-sm text-red-600 text-center py-2">
                    ❌ {downloadError}
                </div>
            )}
        </>
    );
};

ProductCarouselOverlay.propTypes = {
    images: PropTypes.array,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onDeleteRequest: PropTypes.func,
    source: PropTypes.string,
    editable: PropTypes.bool,
    isEmbedded: PropTypes.bool,
};

export default ProductCarouselOverlay;
