# Use an official Node.js LTS (Long Term Support) version as a parent image
FROM node:lts

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Run Prisma client generation during the build process
RUN npx prisma generate

# Start the application
CMD ["npm", "start"]