# Vacina Digital - Docker Setup

This project includes Docker configuration for both development and production environments.

## Prerequisites

- Docker Desktop installed
- Docker Compose (included with Docker Desktop)

## Quick Start with Docker Compose

The easiest way to run the application is using Docker Compose:

```bash
# Start the development environment
docker-compose up dev

# The application will be available at http://localhost:5173
```

## Alternative: Running Pre-built Images

If you want to run the containers individually:

```bash
# Run the development container
docker run -p 5173:5173 vacina-digital-dev

# Run the production container
docker run -p 8080:80 vacina-digital-prod
```

## Building Images Manually

If you need to rebuild the images:

```bash
# Build the development image
docker build -f Dockerfile.dev -t vacina-digital-dev .

# Build the production image
docker build -t vacina-digital-prod .
```

## Environment Variables

The application expects the following environment variables for connecting to Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

These are automatically loaded from your `.env` file when using `docker-compose`.

## Ports

- Development: Port 5173 (Vite dev server)
- Production: Port 8080 (Nginx server)

## Stopping Containers

To stop the running containers:

```bash
# If using docker-compose
docker-compose down

# Or to stop individual containers
docker stop vacina-digital-dev-container
docker stop vacina-digital-prod-container
```

## Cleaning Up

To remove the containers:

```bash
# Remove containers created with compose
docker-compose down

# Remove images (optional)
docker rmi vacina-digital-dev vacina-digital-prod
```