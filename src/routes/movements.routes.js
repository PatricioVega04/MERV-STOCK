import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getMovements, exportMovements, deleteMovements } from '../controllers/movements.controller.js';

const router = Router();

router.get('/movements', authRequired, getMovements);
router.get('/movements/export', authRequired, exportMovements);
router.delete('/movements', authRequired, deleteMovements);

export default router;