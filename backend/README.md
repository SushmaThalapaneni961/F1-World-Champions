# F1 World Champions Backend

This is the backend service for the F1 World Champions project, built with Node.js, Express, MongoDB, and Redis.

## Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: For type-safe code
- **MongoDB**: Primary database
- **Mongoose**: MongoDB ODM
- **Redis**: Caching layer
- **Jest**: Testing framework
- **Swagger/OpenAPI**: API documentation
- **Docker**: Containerization

## Features

- RESTful API endpoints for F1 World Champions and race data
- Data caching with Redis for improved performance
- Automated data updates from external F1 API
- Comprehensive API documentation with Swagger
- Error handling middleware
- Request validation
- TypeScript types for all entities
- Unit and integration tests

## Project Structure

```
backend/
├── src/
│   ├── controllers/    # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   ├── middleware/    # Custom middleware
│   └── app.ts         # Application setup
├── tests/             # Test files
├── swagger/           # API documentation
└── tsconfig.json      # TypeScript configuration
```

## API Endpoints

### Champions
- `GET /api/champions` - Get all F1 World Champions
- `GET /api/champions/:year` - Get World Champion for specific year

### Races
- `GET /api/races/:year` - Get all races for a specific year
- `GET /api/races/:year/:round` - Get specific race details

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB
- Redis
- npm or yarn package manager

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/f1
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:5001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Docker Development

The backend is part of the Docker Compose setup. To run the entire stack:

```bash
# From the project root
docker compose up backend
```

## Database Management

### MongoDB

- Access MongoDB Express UI: http://localhost:8081
- Default credentials:
  - Username: admin
  - Password: pass
  (Set these in your environment variables as MONGO_EXPRESS_USER and MONGO_EXPRESS_PASS)

### Redis Cache Management

To clear the Redis cache:
```bash
# Using redis-cli
redis-cli FLUSHALL

# Using API endpoint
curl -X POST http://localhost:5001/api/cache/clear
```

## API Documentation

Swagger UI is available at: http://localhost:5001/api-docs

Features documented:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Lint code
- `npm run format`: Format code

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error responses follow the format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## Caching Strategy

- Race results are cached for 24 hours
- Champions data is cached for 1 hour
- Cache can be manually cleared via API endpoint

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update API documentation
4. Ensure all tests pass before submitting PR

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure network connectivity

2. **Redis Connection Issues**
   - Check if Redis server is running
   - Verify Redis host and port
   - Check Redis connection logs

3. **API Errors**
   - Check server logs for detailed error messages
   - Verify request format matches API documentation
   - Ensure all required environment variables are set
