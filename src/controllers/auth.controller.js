import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; 
import { TOKEN_SECRET } from '../config.js';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);




export const register = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        // --- INICIO DE LA DEPURACIÓN ---
        console.log("--- DIAGNÓSTICO DE SENDGRID ---");
        console.log("API Key cargada:", process.env.SENDGRID_API_KEY ? `Sí, comienza con ${process.env.SENDGRID_API_KEY.substring(0, 5)}...` : "NO, está undefined");
        console.log("Email remitente:", process.env.VERIFIED_SENDER_EMAIL);
        console.log("---------------------------------");
        // --- FIN DE LA DEPURACIÓN ---

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json(["El email ya está en uso"]);
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            verificationToken,
        });
        await newUser.save();

        const confirmationUrl = `http://localhost:5173/confirm/${verificationToken}`;

        const msg = {
            to: newUser.email,
            from: process.env.VERIFIED_SENDER_EMAIL,
            subject: 'Confirma tu cuenta en Gestor de Stock',
            html: `<h1>¡Bienvenido!</h1><p>Haz clic para activar tu cuenta:</p><a href="${confirmationUrl}">Confirmar Cuenta</a>`,
        };

        await sgMail.send(msg);

        res.status(201).json({ message: "Usuario registrado. Revisa tu email." });

    } catch (error) {
        // Este log ahora mostrará el error exacto de SendGrid si lo hay
        console.error("Error detallado en el registro:", error.response ? error.response.body : error);
        res.status(500).json({ message: "Error al registrar el usuario" });
    }
};
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(404).json({ message: "Token inválido o la cuenta ya ha sido verificada." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({ message: "¡Cuenta confirmada exitosamente! Ya puedes iniciar sesión." });
    } catch (error) {
        console.error("Error al confirmar email:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

        if (!userFound.isVerified) {
            return res.status(403).json({ message: "Debes confirmar tu cuenta por email antes de iniciar sesión." });
        }

        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

        const token = await createAccessToken({ id: userFound._id, username: userFound.username });
        res.cookie("token", token);
        res.json({ id: userFound._id, username: userFound.username, email: userFound.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const verifyToken = (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: "No autorizado" });
        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: "No autorizado" });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        });
    });
};

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id);
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({
        id: userFound.id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
    });
};