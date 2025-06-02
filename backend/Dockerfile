# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire backend code
COPY . .

# Build the project
RUN npm run build

# Ensure the docs directory is copied to the dist folder
RUN cp -r src/docs dist/

# Expose the API port
EXPOSE 5001

# Start the server
CMD ["npm", "start"]