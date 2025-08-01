import express from 'express';  
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/task.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use('/api', taskRoutes);
app.use('/api', authRoutes);

export default app;