import User from '../models/user.model.js'; 
import bcrypt from 'bcryptjs'; 
import { createAccessToken } from '../libs/jwt.js'; 
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';


export const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
       const UserFound = await User.findOne({ email });
       {
            if (UserFound) {
                return res.status(400).json(["El usuario ya existe"]);
            }
        };

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: passwordHash, username });
        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved.id });
        res.cookie("token", token);
        res.json({ id: userSaved.id, username: userSaved.username, email: userSaved.email });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar el usuario");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const UserFound = await User.findOne({ email });
        if (!UserFound) return res.status(400).send("Usuario no encontrado");
        const isMatch = await bcrypt.compare(password, UserFound.password);
        if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas" });
        const token = await createAccessToken({ id: UserFound.id });
        res.cookie("token", token); // Asegúrate de que el token se envíe con las cookies
        res.json({ id: UserFound.id, username: UserFound.username, email: UserFound.email });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al ingresar datos del usuario");
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.sendStatus(200);
};


export const verifyToken = (req, res) => {
    const token = req.cookies.token; 
    
    if (!token) return res.status(401).json({ message: "No se proporcionó un token" });

    jwt.verify(token, TOKEN_SECRET, async  (err, user) => {

        if (err) return res.status(401).json({ message: "Token inválido" });
        const UserFound = await User.findById(user.id);

        if(!UserFound) return res.status(404).json({ message: "Usuario no encontrado" });

       return res.json({ id: UserFound.id, username: UserFound.username, email: UserFound.email });
    });
};

export const profile = async (req, res) => {
    const userFound  = await User.findById(req.user.id) 
    if (!userFound) return res.status(404).json({message: "Usuario no encontrado"});
    res.json({id: userFound.id, username: userFound.username, email: userFound.email, createdAt: userFound.createdAt, updatedAt: userFound.updatedAt});
};