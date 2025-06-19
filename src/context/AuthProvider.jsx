import {
    createContext,
    useState,
    useEffect,
    useContext
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { logoutHelper } from "./authHelpers";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // 📷 Cargar imagen de perfil si es protegida (usa blob), sino setea directamente
    const loadProfileImage = async (userData) => {
        const url = userData?.image_url;
        if (!url) {
            setProfileImage(null);
            return;
        }

        // 👉 Si necesitas proteger las imágenes, puedes reactivar esta lógica:
        // try {
        //   const blobUrl = await fetchBlobFromUrl(url);
        //   setProfileImage(blobUrl);
        // } catch (err) {
        //   console.warn("❌ Imagen de perfil no cargada:", err);
        //   setProfileImage(null);
        // }

        // ✅ Si es una URL pública servida desde MinIO o Django, úsala directamente:
        setProfileImage(url);
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
            } catch (e) {
                await logout(); // 🔐 Cierra sesión si falla
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, []);

    const login = async ({ username, password }) => {
        setError(null);
        setLoading(true);

        try {
            const res = await axiosInstance.post("/users/login/", {
                username,
                password,
            });

            const {
                access_token,
                refresh_token,
                fastapi_token,
                user: userData,
            } = res.data;

            sessionStorage.setItem("accessToken", access_token);
            sessionStorage.setItem("refreshToken", refresh_token);
            sessionStorage.setItem("fastapiToken", fastapi_token);

            setUser(userData);
            setIsAuthenticated(true);
            await loadProfileImage(userData);

            // 🚀 Forzar reload para recargar estado y UI
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err?.response?.data?.detail || "Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutHelper();
        } catch {
            /* noop */
        } finally {
            sessionStorage.clear();
            setUser(null);
            setIsAuthenticated(false);
            setProfileImage(null);
            setError(null);
            navigate("/login");
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
                logout
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
