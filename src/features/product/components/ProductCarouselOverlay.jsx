import React, { useState, useEffect, useCallback } from "react";
import { TrashIcon, DocumentIcon } from "@heroicons/react/24/outline";
import Spinner from "../../../components/ui/Spinner";
import PropTypes from "prop-types";

const ProductCarouselOverlay = ({
    images = [],
    productId,
    subproductId = null,
    onClose,
    onDeleteSuccess,
    onDeleteRequest,
    editable = false,
    isEmbedded = false,
    source = "django",
}) => {
    const [current, setCurrent] = useState(0);
    const [localImages, setLocalImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imgLoaded, setImgLoaded] = useState(false);

    // Media type detection
    const isPDF = (type = "") => type === "application/pdf";
    const isVideo = (type = "") => type.startsWith("video/");
    const isImage = (type = "") => type.startsWith("image/");

    const getMediaType = (type = "", filename = "") => {
        const lowered = type.toLowerCase();
        const ext = filename.toLowerCase().split(".").pop();

        if (lowered === "application/pdf" || ext === "pdf") return "pdf";
        if (lowered.startsWith("video/") || ["mp4", "webm", "mov"].includes(ext)) return "video";
        if (lowered.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return "image";

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
        setCurrent(0);
        if (!images?.length) {
            setLocalImages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setImgLoaded(false);
        const preload = async () => {
            try {
                const formatted = images.map((img) => {
                    const contentType =
                        img.contentType ||
                        img.content_type ||
                        img.mimeType ||
                        "application/octet-stream";

                    return {
                        ...img,
                        id: img.drive_file_id || img.id,
                        filename: img.filename || img.name || img.id,
                        contentType,
                        url: img.url,
                    };
                });
                setLocalImages(formatted.filter((img) => !!img.url));
            } catch (error) {
                console.error("❌ Error cargando archivos:", error);
                setLocalImages([]);
            } finally {
                setLoading(false);
            }
        };

        preload();
    }, [images]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "ArrowRight") nextSlide();
            else if (e.key === "ArrowLeft") prevSlide();
            else if (e.key === "Escape" && !isEmbedded) onClose?.();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [current, localImages, isEmbedded, onClose, nextSlide, prevSlide]);

    useEffect(() => {
        if (current >= localImages.length && localImages.length > 0) {
            setCurrent(localImages.length - 1);
        }
    }, [current, localImages.length]);

    const openInNewTab = (url) => window.open(url, "_blank");

    const handleDelete = () => {
        const file = localImages[current];
        if (file && typeof onDeleteRequest === "function") {
            onDeleteRequest(file);
        }
    };

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
                No se encontraron archivos multimedia.
            </div>
        );
    }


    const safeIndex = Math.min(current, localImages.length - 1);
    const currentItem = localImages[safeIndex];
    const mediaType = getMediaType(
        currentItem?.contentType,
        currentItem?.filename
    );

    return (
        <div className="w-full">
            <div className="relative w-full pt-[66%] bg-black rounded overflow-hidden mb-4">
                <div className="absolute top-0 left-0 w-full h-full z-10 flex items-center justify-center">
                    {!imgLoaded && mediaType === "image" && (
                        <div className="absolute flex flex-col items-center justify-center z-20">
                            <Spinner size="6" color="text-white" />
                            <p className="text-sm text-white mt-2">Cargando imagen...</p>
                        </div>
                    )}

                    {mediaType === "video" ? (
                        <video
                            src={currentItem.url}
                            controls
                            className="w-full h-full object-contain"
                            title={currentItem.filename}
                            onCanPlay={() => setImgLoaded(true)}
                        />
                    ) : mediaType === "pdf" ? (
                        <button
                            onClick={() => openInNewTab(currentItem.url)}
                            className="flex flex-col items-center justify-center space-y-2 bg-gray-100 p-4 rounded"
                            title={`Ver PDF: ${currentItem.filename}`}
                        >
                            <DocumentIcon className="w-12 h-12 text-red-600" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">
                                {currentItem.filename}
                            </span>
                        </button>
                    ) : mediaType === "image" ? (
                        <img
                            src={currentItem.url}
                            onLoad={() => setImgLoaded(true)}
                            onClick={() => openInNewTab(currentItem.url)}
                            className={`w-full h-full object-contain cursor-pointer transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                            alt={currentItem.filename || "archivo"}
                            title={currentItem.filename}
                        />
                    ) : (
                        <div className="text-white text-sm">Tipo no soportado</div>
                    )}
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-20"
                    aria-label="Anterior"
                >
                    ◀
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-20"
                    aria-label="Siguiente"
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
                        key={`dot-${idx}`}
                        onClick={() => {
                            setCurrent(idx);
                            setImgLoaded(false);
                        }}
                        className={`w-3 h-3 mx-1 rounded-full ${idx === current ? "bg-blue-500" : "bg-gray-400"}`}
                        aria-label={`Slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

ProductCarouselOverlay.propTypes = {
    images: PropTypes.array,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subproductId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onClose: PropTypes.func,
    onDeleteSuccess: PropTypes.func,
    onDeleteRequest: PropTypes.func,
    editable: PropTypes.bool,
    isEmbedded: PropTypes.bool,
    source: PropTypes.string,
};

export default ProductCarouselOverlay;
