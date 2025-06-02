# F1 World Champions Frontend

This is the frontend application for the F1 World Champions project, built with React, TypeScript, and Material-UI.

## Tech Stack

- **React 18+**: Modern UI library for building user interfaces
- **TypeScript**: For type-safe code and better developer experience
- **Jotai**: Atomic state management solution
- **Material-UI (MUI)**: Component library for consistent and beautiful UI
- **Vite**: Next-generation frontend build tool
- **Vitest**: Unit testing framework
- **React Router**: For client-side routing
- **Axios**: HTTP client for API requests

## Features

- Responsive design that works on desktop and mobile devices
- Interactive list of F1 World Champions from 2005 to present
- Detailed view of race winners for each season
- Highlighted races where the winner became that year's world champion
- Error handling and loading states
- Dark/Light theme support
- Cached API responses for better performance

## Project Structure

```
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # Redux store configuration and slices
│   ├── services/      # API service layer
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
├── tests/             # Test files
└── vite.config.ts     # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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

## Environment Variables

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5001 # Backend API URL
```

## Docker Development

The frontend is part of the Docker Compose setup. To run the entire application:

```bash
# From the project root
docker compose up frontend
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run test`: Run tests
- `npm run lint`: Lint code
- `npm run format`: Format code with Prettier

## Code Style and Linting

The project uses:

- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Husky for pre-commit hooks

## Browser Support

The application supports:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **"Module not found" errors**

   - Run `npm install` to ensure all dependencies are installed
   - Check if `.env` file exists with correct variables

2. **Development server won't start**

   - Check if port 5173 is available
   - Ensure Node.js version is 18.17 or higher

3. **Tests failing**
   - Ensure all dependencies are installed
   - Check if the test environment variables are set correctly
