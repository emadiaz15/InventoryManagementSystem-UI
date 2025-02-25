import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Verifica si hay un token válido en sessionStorage y, si existe, comprueba el perfil
    const validateToken = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const { data } = await axiosInstance.get("/users/profile/");
            setUser(data);
            setIsAuthenticated(true);
        } catch (error) {
            // Si falla la validación, hacemos logout
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Lógica de login: guarda el token en sessionStorage y va a dashboard
    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post("/users/login/", credentials);
            // Asumiendo que el backend devuelve { access_token, user }
            if (response.data?.access_token) {
                sessionStorage.setItem("accessToken", response.data.access_token);
                setUser(response.data.user || null); // si el backend devuelve user
                setIsAuthenticated(true);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    // Lógica de logout: llama al endpoint, limpia sessionStorage y redirige
    const logout = async () => {
        try {
            await axiosInstance.post("/users/logout/");
        } catch (error) {
            console.error("Error en logout:", error);
        } finally {
            sessionStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
            navigate("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
