# Stage 1: Build React App
FROM node:18 as builder

WORKDIR /app

# Copy only the frontend code
COPY fertilizer-optimizer/package.json fertilizer-optimizer/package-lock.json ./
RUN npm install

COPY fertilizer-optimizer/ ./
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:latest

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
