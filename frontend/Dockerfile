# frontend/Dockerfile
FROM node:20-alpine  

# working directory
WORKDIR /app

# package*.json file 
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy all changes on frontend
COPY . .

# expose the app on port 5173
EXPOSE 5173

# Start your frontend application with host set to 0.0.0.0 to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
