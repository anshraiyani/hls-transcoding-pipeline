# Use the Alpine base image with Node.js
FROM node:alpine

# Create working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Create directories for temp files
RUN mkdir -p /usr/src/app/temp /usr/src/app/output

# Install FFmpeg and its dependencies
RUN apk add --no-cache ffmpeg

# Command to run the processing script
CMD ["node", "index.js"]