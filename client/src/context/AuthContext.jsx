import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
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
    const [errors, setErrors] = useState([]); 
    const [loading, setLoading] = useState(true);

    // --- FUNCIÓN DE REGISTRO CORREGIDA ---
    const signup = async (userData) => { 
        try {
            const res = await registerRequest(userData);
            console.log("Respuesta del registro:", res.data);
            return res.data;
        } catch (error) {
            console.error("Error en signup (AuthContext):", error.response?.data);
            
            // --- AQUÍ ESTÁ LA CORRECCIÓN ---
            // Nos aseguramos de que 'errors' sea siempre un array.
            const errorData = error.response.data;
            if (Array.isArray(errorData)) {
                setErrors(errorData);
            } else if (errorData.message) {
                setErrors([errorData.message]); // Convertimos el objeto de error en un array de strings
            } else {
                setErrors(["Ha ocurrido un error inesperado"]);
            }
        }
    };

    // --- FUNCIÓN DE LOGIN (SIN CAMBIOS GRANDES) ---
    const signin = async (userData) => { 
        try {
            const res = await loginRequest(userData);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]); 
        } catch (error) {
            console.error("Error en signin (AuthContext):", error.response?.data); 
            // El backend devolverá un error si el usuario no está verificado.
            // Lo guardamos para mostrarlo en el formulario de login.
            setErrors(error.response.data.message ? [error.response.data.message] : error.response.data);
        }
    };

    const logout = () => {
        Cookies.remove("token"); 
        setIsAuthenticated(false);
        setUser(null);
    };

    // Limpia los errores después de 5 segundos
    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // Verifica la autenticación al cargar la página
    useEffect(() => {
        async function checkAuth() {
            const cookies = Cookies.get();
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null);
                return;
            }

            try {
                const res = await verifyTokenRequest(cookies.token); 
                if (!res.data) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }
                
                setIsAuthenticated(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            signup, // <-- Nombre corregido a minúscula
            signin, 
            logout, 
            user, 
            isAuthenticated, 
            loading, 
            errors 
        }}>
            {children}
        </AuthContext.Provider>
    );
};