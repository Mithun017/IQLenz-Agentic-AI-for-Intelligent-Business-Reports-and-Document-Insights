# Frontend Dockerfile
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app explicitly for production routing if needed (optional for dev container)
# RUN npm run build

# Expose the Vite port
EXPOSE 5173

# Start the application using Vite's development server, accessible on the network
CMD ["npm", "run", "dev", "--", "--host"]
