# F1 World Champions

A full-stack web application that displays Formula 1 World Champions from 2005 to the present year, along with race winners for each season. The application provides an interactive interface to explore F1 championship data with real-time updates and caching for optimal performance.

## 🌟 Features

- **Championship Data**: View F1 World Champions from 2005 to present
- **Race Details**: Click on a season to see all race winners for that year
- **Champion Highlights**: Races where the winner became that season's champion are highlighted
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type Safety**: Fully typed with TypeScript
- **Caching**: Redis caching for improved performance
- **API Documentation**: Complete OpenAPI/Swagger documentation
- **Comprehensive Tests**: Full test coverage for both frontend and backend

## 🚀 Getting Started

### Prerequisites
- Docker Desktop (required for Windows and macOS)
  - Download and install from [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Ensure Docker Desktop is running before proceeding
- Docker and Docker Compose (included with Docker Desktop)
- Node.js >= 18.17
- npm or yarn

### Step-by-Step Setup

1. Clone the repository and switch to main branch:
```bash
git clone https://github.com/SushmaThalapaneni961/F1-World-Champions
cd F1-World-Champions
git checkout main
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Create a `.env` file in the root directory:
```env
MONGO_EXPRESS_USER=admin
MONGO_EXPRESS_PASS=pass
```

5. Start the application using Docker Compose:
```bash
docker-compose up --build
```

### Accessing the Application

Once all containers are running, you can access:

1. **Frontend Application**
   - URL: http://localhost:5173
   - View F1 World Champions and race results

2. **Backend API & Documentation**
   - API Base URL: http://localhost:5001
   - Swagger Documentation: http://localhost:5001/api-docs
   - Test API endpoints directly in Swagger UI

3. **Database Management**
   - MongoDB Express UI: http://localhost:8081
   - Login credentials:
     - Username: admin
     - Password: pass
   - Database name: f1
   - View collections:
     - champions
     - races

### Verifying Setup

1. Check if all containers are running:
```bash
docker compose ps
```

2. Check container logs if needed:
```bash
docker compose logs -f
```

3. Test API endpoints:
   - Open Swagger UI at http://localhost:5001/api-docs
   - Try the GET /api/champions endpoint

4. View data in MongoDB:
   - Open MongoDB Express at http://localhost:8081
   - Login with admin/pass
   - Select 'f1' database
   - Browse collections

### Stopping the Application

To stop all containers:
```bash
docker compose down
```

To stop and remove volumes (will delete database data):
```bash
docker compose down -v
```

## 🛠️ Tech Stack

### Frontend
- **React 18+** with TypeScript
- **Jotai** for state management
- **Material-UI (MUI)** for components
- **Vite** for build tooling
- **Vitest** for testing
- **Axios** for API requests

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Redis** for caching
- **Jest** for testing
- **OpenAPI/Swagger** for documentation

### Infrastructure
- **Docker** and Docker Compose for containerization
- **MongoDB Express** for database management
- **Redis Commander** for cache monitoring
- **GitHub Actions** for CI/CD

## 📚 Documentation

### API Documentation
- Access Swagger UI at http://localhost:5001/api-docs
- Includes all endpoints, schemas, and example requests
- Try out API endpoints directly from the UI

### Database Management
- MongoDB Express UI: http://localhost:8081
- Default credentials: admin/pass
- Database: f1
- View, edit, and query data directly

### Cache Management
- View cache status via API endpoint: GET /api/cache/status
- Clear cache: POST /api/cache/clear
- Monitor Redis: http://localhost:8081

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## 🔧 Configuration

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5001  # Backend API URL
```

### Backend Environment Variables
```env
PORT=5001                           # Server port
MONGO_URI=mongodb://mongo:27017/f1  # MongoDB connection string
REDIS_HOST=redis                    # Redis host
REDIS_PORT=6379                     # Redis port
```

## 📦 Project Structure

```
f1-world-champions/
├── frontend/                # React frontend application
├── backend/                 # Node.js backend application
├── docs/                    # Documentation files
└── docker-compose.yml       # Docker composition
```

## 🔍 Troubleshooting

### Common Issues

1. **Docker Compose Issues**
   - Ensure all required ports are available
   - Check Docker logs: `docker compose logs -f`
   - Verify environment variables are set

2. **Database Connection Issues**
   - Verify MongoDB is running: `docker compose ps`
   - Check MongoDB logs: `docker compose logs mongo`
   - Ensure correct connection string

3. **Cache Issues**
   - Verify Redis is running: `docker compose ps`
   - Check Redis logs: `docker compose logs redis`
   - Clear cache if needed: `curl -X POST http://localhost:5001/api/cache/clear`

### Performance Optimization
- Enable Redis cache for better performance
- Use production builds for deployment
- Configure appropriate cache TTLs

### Docker Issues

1. **Docker Desktop Not Running**
   - Ensure Docker Desktop is running before executing any docker commands
   - Look for the Docker Desktop icon in your system tray
   - On Windows/macOS, you can start Docker Desktop from the Applications/Programs menu

2. **Port Conflicts**
   - If you see errors about ports being in use, ensure no other applications are using:
     - Port 5173 (Frontend)
     - Port 5001 (Backend)
     - Port 27017 (MongoDB)
     - Port 6379 (Redis)
     - Port 8081 (Mongo Express)

3. **Container Start-up Issues**
   - Check Docker Desktop dashboard for container status
   - View container logs in Docker Desktop or using:
     ```bash
     docker-compose logs -f
     ```
   - Ensure Docker Desktop has sufficient resources allocated (Memory, CPU)

4. **Resource Issues**
   - In Docker Desktop settings, ensure you have allocated:
     - At least 4GB of RAM
     - At least 2 CPU cores
   - Settings path:
     - Windows/Mac: Docker Desktop > Settings > Resources

5. **Clean Start**
   If you're experiencing issues, try a clean start:
   ```bash
   # Stop and remove all containers
   docker-compose down

   # Remove all volumes
   docker-compose down -v

   # Rebuild and start
   docker-compose up --build
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Formula 1 for providing the data

## 🏗️ Architecture

The application follows a modern microservices architecture with Docker containerization. Detailed architecture diagrams are available in the `docs/architecture` directory:

1. **System Architecture** (`docs/architecture/system-architecture.mmd`)
   - High-level overview of all system components
   - Container relationships and communication
   - Port mappings and external interfaces

2. **Component Architecture** (`docs/architecture/component-architecture.mmd`)
   - Detailed frontend and backend component structure
   - State management flow
   - Service layer organization

3. **Caching Strategy** (`docs/architecture/caching-strategy.mmd`)
   - Redis caching implementation
   - Cache invalidation and update flows
   - TTL configurations for different data types

4. **Deployment Architecture** (`docs/architecture/deployment-architecture.mmd`)
   - Docker container organization
   - Network configuration
   - Volume management
   - Environment setup

To view these diagrams:
1. Install Mermaid CLI: `npm install -g @mermaid-js/mermaid-cli`
2. Generate PNG files: `mmdc -i docs/architecture/*.mmd -o docs/architecture/`
3. View the generated PNG files in the `docs/architecture` directory
