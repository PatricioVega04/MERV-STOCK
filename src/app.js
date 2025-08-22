import express from 'express';  
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/task.routes.js';
import authRoutes from './routes/auth.routes.js';
import  cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use('/api', taskRoutes);
app.use('/api', authRoutes);

export default app;