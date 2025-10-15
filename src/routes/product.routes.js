import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

router.get('/products', authRequired, getAllProducts);
router.post('/products', authRequired, createProduct);
router.get('/products/:id', authRequired, getProductById);
router.put('/products/:id', authRequired, updateProduct);
router.delete('/products/:id', authRequired, deleteProduct);

export default router;