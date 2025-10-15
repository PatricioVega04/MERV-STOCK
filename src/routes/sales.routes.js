import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { registerSale } from '../controllers/sale.controller.js';

const router = Router();
router.post('/sales', authRequired, registerSale);

export default router;