import { Router } from "express";
import User from "../models/user.model.js"; 
import bcrypt from "bcryptjs";  
import { createAccessToken } from "../libs/jwt.js";

const router = Router();


router.post("/register", async (req, res) => {
    const { email, password, username } = req.body;
   try {
       const passwordHash = await bcrypt.hash(password, 10)
       const newUser = new User({ email, password: passwordHash, username });
       const userSaved = await newUser.save();
       const token = await createAccessToken({ id: userSaved._id})
       res.cookie("token", token)
       res.json({ id: userSaved._id, username: userSaved.username, email: userSaved.email});
   } catch (error) {
       console.error(error);
       res.status(500).send("Error al registrar el usuario");
   }
});
router.post("/login", async (req, res) => {
    const { email, password} = req.body;
   try {
      const UserFound = await User.findOne({email})
         if (!UserFound) return res.status(400).send("Usuario no encontrado");
       const isMatch = await bcrypt.compare(password, UserFound.password);
         if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas" });
       const token = await createAccessToken({ id: UserFound._id})
       res.cookie("token", token)
       res.json({ id: UserFound._id, username: UserFound.username, email: UserFound.email});
   } catch (error) {
       console.error(error);
       res.status(500).send("Error al ingresar datos del usuario");
   }
});

  

export default router;