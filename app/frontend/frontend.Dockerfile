FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Set OpenSSL legacy provider to avoid error
# ENV NODE_OPTIONS="--openssl-legacy-provider"

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the React app
RUN npm run build

# Use Nginx for serving the frontend
FROM nginx:alpine

# Copy the built React files
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
