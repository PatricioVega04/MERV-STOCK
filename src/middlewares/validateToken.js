import {TOKEN_SECRET} from '../config.js';  
import jwt from 'jsonwebtoken';

export const authRequired = (req, res, next) => {
    const { token } = req.cookies; 
    if (!token) {
        return res.status(401).json({ message: "No autorizado, no hay token" });
    }
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Error al verificar el token:", err);
            return res.status(403).json({ message: "Token inválido" });
        }
        req.user = user;
        next();
    });
};
