# F1 World Champions

A full-stack web application that displays Formula 1 World Champions from 2005 to the present year, along with race winners for each season.

## Features

- View F1 World Champions from 2005 to present
- Click on a season to see all race winners for that year
- Highlighted races where the winner was also that season's champion
- Responsive design with Material-UI components
- Fully typed with TypeScript
- Comprehensive test coverage

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Material-UI for components
- Vite for build tooling
- Vitest for testing

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Redis for caching
- OpenAPI documentation
- Automated data refresh

## Getting Started

### Prerequisites
- Node.js >= 18.17
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/f1-world-champions.git
cd f1-world-champions
```

2. Start the application using Docker Compose:
```bash
docker compose up
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs
- MongoDB Express: http://localhost:8081

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server. It includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
