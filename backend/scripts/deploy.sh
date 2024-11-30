#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Run database migrations if any
echo "Running database migrations..."
# Add migration commands here if needed

# Start the application
echo "Starting the application..."
npm run start:prod

echo "Deployment completed successfully!"
