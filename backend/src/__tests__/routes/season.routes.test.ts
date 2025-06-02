import express from 'express';
import request from 'supertest';
import seasonRoutes from '../../routes/season.routes';
import * as seasonController from '../../controllers/seasonController';
import { errorHandler } from '../../middlewares/errorHandler';

jest.mock('../../controllers/seasonController');
jest.mock('../../config/redis', () => ({
  __esModule: true,
  default: {
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue('OK'),
  },
}));

describe('Season Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/seasons', seasonRoutes);
    app.use(errorHandler);
    jest.clearAllMocks();
  });

  describe('GET /api/seasons', () => {
    it('should route to getAllSeasons controller', async () => {
      // Arrange
      const mockResponse = {
        status: 'success',
        data: [{ season: '2023', champion: { fullName: 'Max Verstappen' } }],
      };

      const mockGetAllSeasons = seasonController.getAllSeasons as jest.Mock;
      mockGetAllSeasons.mockImplementation((req, res) => {
        res.json(mockResponse);
      });

      // Act
      const response = await request(app).get('/api/seasons').expect('Content-Type', /json/);

      // Assert
      expect(mockGetAllSeasons).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('should handle controller errors', async () => {
      // Arrange
      const mockGetAllSeasons = seasonController.getAllSeasons as jest.Mock;
      mockGetAllSeasons.mockImplementation((req, res, next) => {
        next(new Error('Test error'));
      });

      // Act
      const response = await request(app).get('/api/seasons').expect('Content-Type', /json/);

      // Assert
      expect(mockGetAllSeasons).toHaveBeenCalled();
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Test error',
        statusCode: 500,
      });
    });
  });
});
