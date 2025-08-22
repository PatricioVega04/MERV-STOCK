
import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyToken} from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authErrors, setAuthErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    
    const signUp = async (userData) => { 
        try { 
            const res = await registerRequest(userData);
            setUser(res.data);
            setIsAuthenticated(true);
            setAuthErrors([]); 
        } catch (error) {
            console.error("Error en signUp (AuthContext):", error.response ? error.response.data : error); // Log para depuración
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data.errors)) {
                    setAuthErrors(error.response.data.errors);
                } 
                else if (Array.isArray(error.response.data) && error.response.data.every(item => typeof item === 'string')) {
                    setAuthErrors(error.response.data.map(msg => ({ message: msg })));
                }
                else if (typeof error.response.data.message === 'string') {
                    setAuthErrors([{ message: error.response.data.message }]);
                } 
                else if (error.response.data.data && typeof error.response.data.data.message === 'string') {
                    setAuthErrors([{ message: error.response.data.data.message }]);
                }
                else if (typeof error.response.data === 'string') {
                    setAuthErrors([{ message: error.response.data }]);
                }
                else {
                    setAuthErrors([{ message: "Error desconocido del servidor (respuesta no esperada)." }]);
                }
            } else {
                setAuthErrors([{ message: "Error de conexión o el servidor no responde." }]);
            }
            setIsAuthenticated(false); 
        }
    };

    const signin = async (userData) => { 
        try {
            const res = await loginRequest(userData);
            setUser(res.data);
            setIsAuthenticated(true);
            setAuthErrors([]); 
        } catch (error) {
            console.error("Error en signin (AuthContext):", error.response ? error.response.data : error); 
            if (error.response && error.response.data) {
                if (Array.isArray(error.response.data.errors)) {
                    setAuthErrors(error.response.data.errors);
                } 
                else if (Array.isArray(error.response.data) && error.response.data.every(item => typeof item === 'string')) {
                    setAuthErrors(error.response.data.map(msg => ({ message: msg })));
                }
                else if (typeof error.response.data.message === 'string') {
                    setAuthErrors([{ message: error.response.data.message }]);
                } 
                else if (error.response.data.data && typeof error.response.data.data.message === 'string') {
                    setAuthErrors([{ message: error.response.data.data.message }]);
                }
                else if (typeof error.response.data === 'string') { 
                    setAuthErrors([{ message: error.response.data }]);
                }
                else {
                    setAuthErrors([{ message: "Error desconocido del servidor (respuesta no esperada)." }]);
                }
            } else {
                setAuthErrors([{ message: "Error de conexión o el servidor no responde." }]);
            }
            setIsAuthenticated(false);
        }
    };
    const logout = () => {
        Cookies.remove("token"); 
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        if (authErrors.length > 0) {
            const timer = setTimeout(() => setAuthErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [authErrors]);

    useEffect(() => {
        async function checkAuth() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

                try {
                    const res = await verifyToken(); 
                    console.log("Token verificado:", res.data);


                    if (res.status === 200 && res.data) {
                    setIsAuthenticated(true);
                    setUser(res.data);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                }
                } catch (error) {
                    console.error("Error al verificar el token:", error);
                    setIsAuthenticated(false);
                    setUser(null);
                }
                finally {
                    setLoading(false); 
                }

            }
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ signUp, signin, logout, user, isAuthenticated, loading, errors: authErrors }}>
            {children}
        </AuthContext.Provider>
    );
};