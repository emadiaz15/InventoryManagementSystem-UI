/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useState,
    useEffect,
    useContext,
    useCallback,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { djangoApi } from "@/api/clients";
import { logoutHelper } from "./authHelpers";
import { getAccessToken, clearTokens } from "@/utils/sessionUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const loadProfileImage = async (userData) => {
        const url = userData?.image_url;
        setProfileImage(url || null);
    };

    const logout = useCallback(async () => {
        try {
            await logoutHelper();
        } catch {
            // noop
        } finally {
            clearTokens();
            setUser(null);
            setIsAuthenticated(false);
            setProfileImage(null);
            setError(null);
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const validateToken = async () => {
            const accessToken = getAccessToken();

            if (!accessToken) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const { data } = await djangoApi.get("/users/profile/");
                setUser(data);
                setIsAuthenticated(true);
                await loadProfileImage(data);
            } catch (e) {
                await logout(); // manejar expiración
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [logout]);

    const login = async ({ username, password }) => {
        setError(null);
        setLoading(true);

        try {
            const res = await djangoApi.post("/users/login/", {
                username,
                password,
            });

            // Ajuste para leer los campos tal como vienen en la API
            const { access_token, refresh_token, user: userData } = res.data;

            sessionStorage.setItem("accessToken", access_token);
            sessionStorage.setItem("refreshToken", refresh_token);

            setUser(userData);
            setIsAuthenticated(true);
            await loadProfileImage(userData);

            window.location.href = "/dashboard";
        } catch (err) {
            setError(err?.response?.data?.detail || "Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isStaff: !!user?.is_staff,
                isAuthenticated,
                loading,
                error,
                profileImage,
                login,
                logout,
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
