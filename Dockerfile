FROM nginx:latest
# Copy the built files from the previous stage
COPY build/ /usr/share/nginx/html
# Expose port 80 (the default HTTP port)
EXPOSE 80
# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
# Use Node.js base image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 6700
EXPOSE 6700

# Start the application
CMD ["node", "server.js"]
