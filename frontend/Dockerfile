FROM node:18-alpine AS build

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build  # Build the Vite application

FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html 

# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 