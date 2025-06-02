# Architecture Diagrams

This directory contains the architecture diagrams for the F1 World Champions application. Below are the descriptions of each diagram and what they represent.

## System Architecture Diagram
`system-architecture.png`

Shows the high-level system architecture including:
- Frontend React Application
- Backend Express Server
- MongoDB Database
- Redis Cache
- External F1 API Integration
- Docker containers and their relationships

## Data Flow Diagram
`data-flow.png`

Illustrates how data flows through the system:
- User interactions
- API requests/responses
- Cache hits/misses
- Database operations
- External API calls

## Component Architecture
`component-architecture.png`

Details the internal architecture of both frontend and backend:
- Frontend:
  - React components hierarchy
  - Jotai atoms for state management
  - Service layer
  - API integration

- Backend:
  - Express middleware
  - Controllers
  - Services
  - Models
  - Database interactions

## Caching Strategy
`caching-strategy.png`

Visualizes the caching implementation:
- Redis cache structure
- Cache invalidation flow
- Cache update strategies
- TTL configurations

## Deployment Architecture
`deployment-architecture.png`

Shows the deployment setup:
- Docker container organization
- Network configuration
- Volume mounts
- Port mappings
- Environment configurations

## Creating/Updating Diagrams

We recommend using [Draw.io](https://draw.io) or [Mermaid](https://mermaid-js.github.io/) for creating and maintaining these diagrams. 

### For Draw.io:
1. Use the `.drawio` source files provided in this directory
2. Export as PNG for documentation
3. Keep both `.drawio` and `.png` files in version control

### For Mermaid:
1. Edit the `.mmd` files in this directory
2. Generate images using Mermaid CLI
3. Keep both `.mmd` and generated image files in version control

## Diagram Standards

1. Use consistent color coding:
   - Frontend components: Blue
   - Backend components: Green
   - Databases: Yellow
   - Cache: Orange
   - External services: Gray

2. Include clear labels and descriptions

3. Show version numbers for major components

4. Indicate data flow directions with arrows

5. Include relevant port numbers and protocols 