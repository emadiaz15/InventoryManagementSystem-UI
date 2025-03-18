import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { logoutHelper } from "./authHelpers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
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
                await logout();
            } finally {
                setLoading(false);
            }
        };

        validateToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axiosInstance.post("/users/login/", credentials);
            if (response.data && response.data.access_token) {
                sessionStorage.setItem("accessToken", response.data.access_token);
                setUser(response.data.user || null);
                setIsAuthenticated(true);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    const logout = async () => {
        try {
            await logoutHelper();
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

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
