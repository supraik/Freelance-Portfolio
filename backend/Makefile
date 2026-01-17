# Portfolio Backend Makefile

.PHONY: help run build test clean install migrate dev docker

# Default target
help:
	@echo "Available targets:"
	@echo "  make run       - Run the server"
	@echo "  make build     - Build the binary"
	@echo "  make test      - Run tests"
	@echo "  make clean     - Clean build artifacts"
	@echo "  make install   - Install dependencies"
	@echo "  make dev       - Run with hot reload (requires air)"
	@echo "  make migrate   - Run database migrations"
	@echo "  make docker    - Build Docker image"
	@echo "  make lint      - Run linter"

# Run the server
run:
	go run cmd/server/main.go

# Build the binary
build:
	@echo "Building..."
	@mkdir -p bin
	go build -o bin/server cmd/server/main.go
	@echo "Binary created at bin/server"

# Build for production (with optimizations)
build-prod:
	@echo "Building for production..."
	@mkdir -p bin
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o bin/server cmd/server/main.go
	@echo "Production binary created at bin/server"

# Run tests
test:
	go test -v ./...

# Run tests with coverage
test-coverage:
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated at coverage.html"

# Clean build artifacts
clean:
	@echo "Cleaning..."
	rm -rf bin/
	rm -f coverage.out coverage.html
	@echo "Clean complete"

# Install dependencies
install:
	@echo "Installing dependencies..."
	go mod download
	go mod tidy
	@echo "Dependencies installed"

# Run with hot reload (requires air)
dev:
	@command -v air > /dev/null || (echo "Installing air..." && go install github.com/air-verse/air@latest)
	air

# Database migrations (requires migrate tool or custom script)
migrate:
	@echo "Running migrations..."
	go run cmd/server/main.go

# Format code
fmt:
	go fmt ./...

# Run linter (requires golangci-lint)
lint:
	@command -v golangci-lint > /dev/null || (echo "Installing golangci-lint..." && go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest)
	golangci-lint run

# Build Docker image
docker:
	docker build -t portfolio-backend .

# Run Docker container
docker-run:
	docker run -p 8080:8080 --env-file .env portfolio-backend

# Generate API documentation (if using swag)
docs:
	@command -v swag > /dev/null || (echo "Installing swag..." && go install github.com/swaggo/swag/cmd/swag@latest)
	swag init -g cmd/server/main.go

# Install development tools
install-tools:
	@echo "Installing development tools..."
	go install github.com/air-verse/air@latest
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install github.com/swaggo/swag/cmd/swag@latest
	@echo "Tools installed"

# Create .env from example if not exists
setup:
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
		echo ".env file created. Please update with your values."; \
	else \
		echo ".env file already exists."; \
	fi
	@mkdir -p uploads
	@echo "Setup complete"
