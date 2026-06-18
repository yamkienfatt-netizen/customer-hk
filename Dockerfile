FROM node:24.15.0-alpine

ARG SITECORE_API_KEY
ARG SITECORE_API_HOST
ARG SITECORE_EDGE_CONTEXT_ID
#ARG PUBLIC_URL

RUN echo "Sitecore API Host: " + $SITECORE_API_HOST
RUN echo "Sitecore API Key: " + $SITECORE_API_KEY
#RUN echo "Public URL: " + $PUBLIC_URL


ENV SITECORE_API_HOST=$SITECORE_API_HOST
ENV SITECORE_API_KEY=$SITECORE_API_KEY
ENV SITECORE_EDGE_CONTEXT_ID=$SITECORE_EDGE_CONTEXT_ID
ENV JSS_SECURITY_HEADER=true
ENV NEXT_PUBLIC_ROLE_CONTENT_DELIVERY=true
ENV ILA_SKIP_INITIAL_RELOAD=false
#ENV PUBLIC_URL=$PUBLIC_URL

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . .

# Update GEOIP
RUN npm run updatedb

# Build the application
RUN npm run build

# Expose port 3000 for the application (OOTB port in Next.js app)
EXPOSE 3000

# Start the application
# Note: if you have another production startup command
# defined in package.json - use you one
CMD [ "npm", "start" ]
