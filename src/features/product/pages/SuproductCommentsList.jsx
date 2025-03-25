import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import Sidebar from "../../../components/common/Sidebar";
import Footer from "../../../components/common/Footer";
import Pagination from "../../../components/ui/Pagination";
import SuccessMessage from "../../../components/common/SuccessMessage";
import ProductCommentCard from "../components/ProductCommentCard"; // Usamos el mismo componente de comentario
import { listSubproductComments } from "../services/listSubproductComments"; // Servicio para obtener comentarios de subproducto

const SubproductCommentsList = () => {
    const { prod_pk, subp_pk } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchComments = async (url = null) => {
        setLoading(true);
        setError(null);
        try {
            const data = await listSubproductComments(prod_pk, subp_pk, url);
            if (data?.results) {
                // Ordenar de más antiguo a más reciente
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
        if (prod_pk && subp_pk) {
            fetchComments();
        }
    }, [prod_pk, subp_pk]);

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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-4 ml-64 mt-14">
                    <h1 className="text-2xl font-bold mb-4">
                        Comentarios del Subproducto
                    </h1>
                    {loading ? (
                        <p className="text-center">Cargando comentarios...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-gray-500">No hay comentarios disponibles.</p>
                    ) : (
                        // Se usa flex-col-reverse para que el comentario más reciente aparezca en la parte superior
                        <div className="flex flex-col-reverse gap-4">
                            {comments.map((comment) => (
                                <ProductCommentCard key={comment.id} comment={comment} />
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
            </div>
            {showSuccess && (
                <SuccessMessage
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}
            <Footer />
        </div>
    );
};

export default SubproductCommentsList;
