# Use an official node runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

ARG DIRECTUS_BASE_URL
ARG DIRECTUS_TOKEN
ARG DIRECTUS_FLOWS_TRIGGER_WEBHOOK
ARG STRAVA_CLIENT_ID
ARG STRAVA_CLIENT_SECRET
ARG STRAVA_REFRESH_TOKEN

ENV DIRECTUS_BASE_URL=${DIRECTUS_BASE_URL}
ENV DIRECTUS_TOKEN=${DIRECTUS_TOKEN}
ENV DIRECTUS_FLOWS_TRIGGER_WEBHOOK=${DIRECTUS_FLOWS_TRIGGER_WEBHOOK}
ENV STRAVA_CLIENT_ID=${STRAVA_CLIENT_ID}
ENV STRAVA_CLIENT_SECRET=${STRAVA_CLIENT_SECRET}
ENV STRAVA_REFRESH_TOKEN=${STRAVA_REFRESH_TOKEN}

# Build the Next.js app
RUN npm run build

# Start the Next.js app
CMD ["npm", "start"]

# Expose port 3000
EXPOSE 3000