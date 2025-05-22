# # Stage 1: Build
# FROM node:20-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # Stage 2: Serve with nginx
# FROM nginx:alpine

# # Copy built files from previous stage
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Expose default nginx port
# EXPOSE 80



# frontend/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]
