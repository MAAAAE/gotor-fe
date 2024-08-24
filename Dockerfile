# Step 1: Use an official Node.js runtime as the base image
FROM node:20-alpine AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package.json ./

# Step 4: Install dependencies
RUN npm install
#    --legacy-peer-deps

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the React application
RUN npm run build

# Step 7: Use an official Nginx image to serve the build output
FROM nginx:stable-alpine

# Step 8: Copy the build output to Nginx's default public directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the port that Nginx will run on
EXPOSE 88

# Step 10: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
