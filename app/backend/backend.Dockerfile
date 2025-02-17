# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . ./

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
