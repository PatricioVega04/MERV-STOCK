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

    const signup = async (userData) => { 
    try {
        const res = await registerRequest(userData);
        return res.data; 
    } catch (error) {
        console.error("Error en signup (AuthContext):", error.response?.data);
        setErrors(error.response.data);
        return null;
    }
};

    const signin = async (userData) => { 
        try {
            const res = await loginRequest(userData);
            setUser(res.data);
            setIsAuthenticated(true);
            setErrors([]); 
        } catch (error) {
            console.error("Error en signin (AuthContext):", error.response?.data);
            setErrors(error.response.data.message ? [error.response.data.message] : error.response.data);
        }
    };

    const logout = () => {
        Cookies.remove("token"); 
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => setErrors([]), 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

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
            signup, 
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