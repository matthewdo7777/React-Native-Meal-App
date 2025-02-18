FROM node:20.13.1-bookworm-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose necessary ports
EXPOSE 8081
EXPOSE 19000
EXPOSE 19006

CMD ["npx", "expo", "start"]