import express from 'express';
import request from 'supertest';
import seasonRoutes from '../../routes/season.routes';
import * as seasonController from '../../controllers/seasonController';

jest.mock('../../controllers/seasonController');

describe('Season Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/api/seasons', seasonRoutes);
  });

  describe('GET /api/seasons', () => {
    it('should route to getAllSeasons controller', async () => {
      // Arrange
      const mockGetAllSeasons = seasonController.getAllSeasons as jest.Mock;
      mockGetAllSeasons.mockImplementation((req, res) => {
        res.json({ status: 'success' });
      });

      // Act
      const response = await request(app).get('/api/seasons');

      // Assert
      expect(mockGetAllSeasons).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should handle controller errors', async () => {
      // Arrange
      const mockGetAllSeasons = seasonController.getAllSeasons as jest.Mock;
      mockGetAllSeasons.mockImplementation((req, res, next) => {
        next(new Error('Test error'));
      });

      // Act
      const response = await request(app).get('/api/seasons');

      // Assert
      expect(mockGetAllSeasons).toHaveBeenCalled();
      expect(response.status).toBe(500);
    });
  });
}); 