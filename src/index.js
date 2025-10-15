import dotenv from 'dotenv'; // <-- ESTA LÍNEA FALTABA
dotenv.config();

import app from './app.js';
import { connectDB } from './db.js';

connectDB();
app.listen(4000)
console.log('Server is running on port 4000');