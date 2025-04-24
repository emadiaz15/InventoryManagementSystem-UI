import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { logoutHelper } from "./authHelpers";
import { fetchProtectedImage } from "../services/imageService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ✅ nuevo estado para error de login

    const navigate = useNavigate();

    const loadProfileImage = async (userData) => {
        if (!userData?.image_url) return;

        try {
            const blobUrl = await fetchProtectedImage(userData.image_url);
            setProfileImage(blobUrl);
        } catch (err) {
            console.warn("❌ No se pudo cargar la imagen de perfil:", err);
            setProfileImage(null);
        }
    };

    useEffect(() => {
        const validateToken = async () => {
            const accessToken = sessionStorage.getItem("accessToken");
            const fastapiToken = sessionStorage.getItem("fastapiToken");

            if (!accessToken || !fastapiToken) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const { data } = await axiosInstance.get("/users/profile/");
                setUser(data);
                setIsAuthenticated(true);
                await loadProfileImage(data);
            } catch (error) {
                await logout();
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    const login = async (credentials) => {
        setError(null); // ✅ limpia errores anteriores
        try {
            const response = await axiosInstance.post("/users/login/", credentials);
            const { refresh_token, access_token, fastapi_token, user } = response.data;

            if (access_token && fastapi_token && refresh_token) {
                sessionStorage.setItem("accessToken", access_token);
                sessionStorage.setItem("refreshToken", refresh_token);
                sessionStorage.setItem("fastapiToken", fastapi_token);

                setUser(user || null);
                setIsAuthenticated(true);
                await loadProfileImage(user);
                navigate("/dashboard");
            }
        } catch (error) {
            const detail = error?.response?.data?.detail || "Ocurrió un error al iniciar sesión.";
            setError(detail); // ✅ actualiza el mensaje de error
        }
    };

    const logout = async () => {
        try {
            await logoutHelper();
        } finally {
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("fastapiToken");
            setUser(null);
            setProfileImage(null);
            setIsAuthenticated(false);
            setError(null); // ✅ limpia error al cerrar sesión
            navigate("/login");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                loading,
                profileImage,
                error, // ✅ incluido en el contexto
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
