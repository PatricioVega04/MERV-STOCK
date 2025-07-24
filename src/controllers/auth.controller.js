import User from '../models/user.model.js'; 
import bcrypt from 'bcryptjs'; 
import { createAccessToken } from '../libs/jwt.js'; 

export const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
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
        res.cookie("token", token);
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

export const profile = async (req, res) => {
    const userFound  = await User.findById(req.user.id) 
    if (!userFound) return res.status(404).json({message: "Usuario no encontrado"});
    res.json({id: userFound.id, username: userFound.username, email: userFound.email, createdAt: userFound.createdAt, updatedAt: userFound.updatedAt});
};