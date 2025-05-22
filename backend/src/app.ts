import express from 'express';
import dotenv from 'dotenv';
import seasonRoutes from './routes/season.routes';
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';


dotenv.config();
const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/seasons', seasonRoutes);

app.use(errorHandler);

export default app;
