import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toolbar from "../../../components/common/Toolbar";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import CommentCard from "../components/CommentCard"; // Componente de comentarios
import { listProductComments } from "../services/listProductComments"; // Servicio para obtener comentarios
import Layout from "../../../pages/Layout";

const ProductCommentsList = () => {
    const { prod_pk } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchComments = async (
        url = `/inventory/products/${prod_pk}/comments/`
    ) => {
        setLoading(true);
        setError(null);
        try {
            const data = await listProductComments(prod_pk, url);
            if (data?.results) {
                // Ordenar de más antiguo a más reciente (mostrados de abajo hacia arriba)
                const sortedComments = data.results.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
                setComments(sortedComments);
                setNextPage(data.next);
                setPreviousPage(data.previous);
            } else {
                setComments([]);
                setError("No hay comentarios disponibles.");
            }
        } catch (error) {
            setError("Error al cargar los comentarios.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (prod_pk) {
            fetchComments();
        } else {
            setError("ID de producto no válido.");
            setLoading(false);
        }
    }, [prod_pk]);

    const handleNextPage = () => {
        if (nextPage) fetchComments(nextPage);
    };

    const handlePreviousPage = () => {
        if (previousPage) fetchComments(previousPage);
    };

    const handleShowSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccess(true);
        fetchComments();
    };

    return (
        <>
            <Layout>
                <div className="flex-1 p-4 mt-14">
                    <Toolbar
                        title="Comentarios del Producto"
                        extraButtons={
                            <button
                                onClick={() => navigate(`/products/${prod_pk}/create-comment`)}
                                className="ml-2 text-white bg-info-500 hover:bg-info-600 px-4 py-2 rounded"
                            >
                                Crear Comentario
                            </button>
                        }
                    />
                    {loading ? (
                        <p className="text-center">Cargando comentarios...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No hay comentarios disponibles.
                        </p>
                    ) : (
                        // Usamos flex-col-reverse para que el comentario más reciente aparezca en la parte superior
                        <div className="flex flex-col-reverse gap-4">
                            {comments.map((comment) => (
                                <CommentCard key={comment.id} comment={comment} />
                            ))}
                        </div>
                    )}
                    <Pagination
                        onNext={handleNextPage}
                        onPrevious={handlePreviousPage}
                        hasNext={Boolean(nextPage)}
                        hasPrevious={Boolean(previousPage)}
                    />
                </div>
            </Layout>
            {showSuccess && (
                <SuccessMessage
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
        </>
    );
};

export default ProductCommentsList;
