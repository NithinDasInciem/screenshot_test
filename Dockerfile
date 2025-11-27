# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build tools for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 make g++


# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package*.json ./

# Install dependencies (bcrypt will build inside the container)
RUN npm ci --only=production

# Copy the rest of the app
COPY . .

# Set environment variable
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
