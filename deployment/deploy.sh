#!/bin/bash

# Exit on error
set -e

# Function to check if running on Windows
is_windows() {
    case "$(uname -s)" in
        CYGWIN*|MINGW*|MSYS*)
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Load environment variables
if [ -f .env ]; then
    source .env
else
    echo "Error: .env file not found. Please create it from .env.template"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
for cmd in docker docker-compose openssl; do
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

# Create SSL certificates if they don't exist
create_ssl_certificates() {
    local domains=("bitebase.app" "apis.bitebase.app" "agentics.bitebase.app")
    
    for domain in "${domains[@]}"; do
        if [ ! -f "nginx/ssl/$domain.crt" ] || [ ! -f "nginx/ssl/$domain.key" ]; then
            echo "Creating SSL certificate for $domain..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout "nginx/ssl/$domain.key" \
                -out "nginx/ssl/$domain.crt" \
                -subj "/C=US/ST=State/L=City/O=Organization/CN=$domain"
        fi
    done
}

# Create necessary directories
mkdir -p nginx/ssl nginx/conf.d

# Create SSL certificates
create_ssl_certificates

# Clean up any existing containers and volumes
echo "Cleaning up existing containers and volumes..."
docker compose down -v || true

# Build and start services
echo "Building and starting services..."
if is_windows; then
    # Windows-specific Docker commands
    docker compose build --no-cache
    docker compose up -d
else
    # Linux/Mac commands
    docker compose build --no-cache
    docker compose up -d
fi

# Wait for services to be ready
echo "Waiting for services to be ready..."
for i in {1..30}; do
    if docker compose ps | grep -q "healthy"; then
        break
    fi
    echo "Waiting for services to be healthy... ($i/30)"
    sleep 10
done

# Check if services are running
echo "Checking service status..."
docker compose ps

# Initialize database
echo "Initializing database..."
for i in {1..5}; do
    if docker compose exec db psql -U bitebase -d bitebase -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" 2>/dev/null; then
        break
    fi
    echo "Retrying database initialization... ($i/5)"
    sleep 5
done

# Create volumes if they don't exist
echo "Creating volumes..."
docker volume create bitebase-postgres_data || true
docker volume create bitebase-ollama_data || true
docker volume create bitebase-langflow_data || true

# Check if all services are healthy
echo "Checking service health..."
if ! docker compose ps | grep -q "healthy"; then
    echo "Warning: Some services are not healthy. Check the logs with 'docker compose logs'"
fi

echo "Deployment completed!"
echo "Services are available at:"
echo "- Frontend: https://bitebase.app"
echo "- API: https://apis.bitebase.app"
echo "- Agentic Services: https://agentics.bitebase.app"

# Display helpful commands
echo -e "\nUseful commands:"
echo "docker compose logs -f [service]  # View logs for a specific service"
echo "docker compose ps                 # Check service status"
echo "docker compose restart [service]  # Restart a specific service"
echo "docker compose down               # Stop all services" 