import { Router } from 'express';
import { register, login, logout, profile, verifyToken, confirmEmail } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middleware.js'; 
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();
router.get('/confirm/:token', confirmEmail);
router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", authRequired, logout);
router.get("/verify-token", authRequired, verifyToken);
router.get("/profile", authRequired, profile);

export default router;