import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import seasonRoutes from './routes/season.routes';
import raceRoutes from './routes/race.routes';
import { errorHandler } from './middlewares/errorHandler';
import { ROUTES } from './constants/routes';
import { requestLogger } from './middlewares/requestLogger';

dotenv.config();

const app = express();

// Load Swagger document
const swaggerPath = path.resolve(__dirname, '..', 'src', 'docs', 'openapi.yaml');
const swaggerDocument = YAML.load(swaggerPath);

// Middleware
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false, // This is needed for Swagger UI to work properly
  }),
);
app.use(express.json());
app.use(requestLogger); // Logs every request

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use(ROUTES.SEASONS, seasonRoutes);
app.use(ROUTES.SEASON_RACES(':season'), raceRoutes);

// Error handling
app.use(errorHandler);

export default app;
