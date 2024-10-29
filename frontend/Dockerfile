# Frontend Dockerfile
FROM node:18-alpine AS build

WORKDIR /app/frontend

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

# Serve the app with NGINX
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
