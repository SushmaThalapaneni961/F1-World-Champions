import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import seasonRoutes from './routes/season.routes';
import raceRoutes from './routes/race.routes';
import { errorHandler } from './middlewares/errorHandler';
import { ROUTES } from './constants/routes';
import { requestLogger } from './middlewares/requestLogger';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger); // Logs every request

app.use(ROUTES.SEASONS, seasonRoutes);
app.use(ROUTES.SEASON_RACES(':seasonId'), raceRoutes);

app.use(errorHandler); // Catch all errors

export default app;
