import express from 'express';
import request from 'supertest';
import raceRoutes from '../../routes/race.routes';
import * as raceController from '../../controllers/raceController';

jest.mock('../../controllers/raceController');

// Mock console methods
const originalConsole = { ...console };
beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

describe('Race Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use('/', raceRoutes);
  });

  describe('GET /', () => {
    it('should route to getAllRaces controller', async () => {
      // Arrange
      const mockGetAllRaces = raceController.getAllRaces as jest.Mock;
      mockGetAllRaces.mockImplementation((req, res) => {
        res.json({ status: 'success' });
      });

      // Act
      const response = await request(app).get('/');

      // Assert
      expect(mockGetAllRaces).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should handle controller errors', async () => {
      // Arrange
      const mockGetAllRaces = raceController.getAllRaces as jest.Mock;
      mockGetAllRaces.mockImplementation((req, res, next) => {
        next(new Error('Test error'));
      });

      // Act
      const response = await request(app).get('/');

      // Assert
      expect(mockGetAllRaces).toHaveBeenCalled();
      expect(response.status).toBe(500);
    });
  });
});
