FROM node:18-alpine AS backend

# Set the working directory inside the Docker container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the port that the Express.js application runs on
EXPOSE 3000

# Command to start the Express.js application
CMD ["npm", "start"]