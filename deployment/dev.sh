#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Creating default .env file..."
    cat > .env << EOL
# Database Configuration
DB_PASSWORD=bitebase123
POSTGRES_USER=bitebase
POSTGRES_DB=bitebase

# JWT Configuration
JWT_SECRET=dev_jwt_secret

# Service Ports
FRONTEND_PORT=3000
BACKEND_PORT=8000
DB_PORT=5432
OLLAMA_PORT=11434
LANGFLOW_PORT=7860
EOL
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
for cmd in docker docker-compose; do
    if ! command_exists $cmd; then
        echo "Error: $cmd is required but not installed."
        exit 1
    fi
done

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Build and start services
echo "Building and starting services in development mode..."
docker compose -f docker-compose.dev.yml down -v || true
docker compose -f docker-compose.dev.yml build --no-cache
docker compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Initialize the database with sample data
echo "Initializing database with sample data..."
docker compose -f docker-compose.dev.yml exec backend python init_db.py

# Pull Ollama models if needed
echo "Pulling required Ollama models..."
docker compose -f docker-compose.dev.yml exec ollama ollama pull llama2

# Display access URLs
echo -e "\nDevelopment services are available at:"
echo "- Frontend: http://localhost:3000"
echo "- API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
echo "- Langflow: http://localhost:7860"
echo "- Ollama API: http://localhost:11434"
echo "- Database: localhost:5432"

# Display helpful commands
echo -e "\nUseful commands:"
echo "docker compose -f docker-compose.dev.yml logs -f [service]  # View logs for a specific service"
echo "docker compose -f docker-compose.dev.yml ps                 # Check service status"
echo "docker compose -f docker-compose.dev.yml restart [service]  # Restart a specific service"
echo "docker compose -f docker-compose.dev.yml down               # Stop all services"
echo "docker compose -f docker-compose.dev.yml exec backend pytest  # Run backend tests"

echo -e "\nDevelopment environment is ready!" 