import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import saleRoutes from './routes/sales.routes.js';
import movementsRoutes from './routes/movements.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', saleRoutes);
app.use('/api', movementsRoutes);

export default app;