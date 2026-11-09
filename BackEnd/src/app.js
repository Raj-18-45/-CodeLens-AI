import express from 'express';
import cors from 'cors';

import aiRoutes from './routes/ai.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

export default app;