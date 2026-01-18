# Portfolio Backend - Quick Start Guide

This guide will help you get the backend up and running in minutes.

## Quick Setup (3 Steps)

### 1. Install Prerequisites

**Go**: Download from [go.dev](https://go.dev/dl/) (version 1.22+)
```bash
go version  # Verify installation
```

**PostgreSQL**: Download from [postgresql.org](https://www.postgresql.org/download/)

### 2. Setup Database

```bash
# Start PostgreSQL (if not running)
# Windows: Start from Services or pgAdmin
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql

# Create database
psql -U postgres
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q
```

### 3. Configure and Run

```bash
# Navigate to backend folder
cd backend

# Install dependencies
go mod download

# Create .env file from example
cp .env.example .env

# Edit .env and update:
# - DATABASE_URL with your password
# - JWT_SECRET (use a long random string)
# - SMTP settings (for email)

# Run the server


```

The server will start on http://localhost:8080

## Create Admin User

After the server is running, create your first admin user:

```bash
# In a new terminal, from backend folder:
go run scripts/create_admin.go

# Follow the prompts to enter:
# - Email
# - Name
# - Password (minimum 8 characters)
```

## Test the API

### Health Check
```bash
curl http://localhost:8080/health
```

### Submit Contact Form
```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message from the API."
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-admin@email.com",
    "password": "your-password"
  }'
```

Save the token from the response to use in authenticated requests.

### Get Contacts (Authenticated)
```bash
curl http://localhost:8080/api/admin/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Using Docker (Alternative)

If you prefer Docker:

```bash
# From project root
docker-compose up -d

# The backend will be available at http://localhost:8080
```

## Development with Hot Reload

For a better development experience:

```bash
# Install Air (hot reload tool)
go install github.com/air-verse/air@latest

# Run with hot reload
air
# or
make dev
```

Now your server will automatically restart when you make code changes!

## Next Steps

1. **Configure Email**: Update SMTP settings in `.env` to enable contact form emails
2. **Secure JWT**: Change JWT_SECRET to a strong random value
3. **Test Endpoints**: Use the API documentation in README.md
4. **Connect Frontend**: Update your React app to use the API endpoints

## Common Issues

### Database Connection Failed
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Ensure database and user exist

### Port Already in Use
- Change PORT in `.env` to a different port
- Or stop the process using port 8080

### Email Not Sending
- Verify SMTP credentials in `.env`
- For Gmail, create an App Password (not your regular password)

## Project Structure

```
backend/
├── cmd/server/main.go         # Entry point
├── internal/
│   ├── handlers/              # API endpoints
│   ├── models/                # Data structures
│   ├── repository/            # Database queries
│   └── services/              # Business logic
├── .env                       # Your config (create from .env.example)
└── uploads/                   # Uploaded files
```

## Available Commands

```bash
# Development
make run          # Run server
make dev          # Run with hot reload
make build        # Build binary

# Testing
make test         # Run tests
make test-coverage # Generate coverage report

# Utilities
make fmt          # Format code
make clean        # Clean build artifacts
make help         # Show all commands
```

## Getting Help

- Check [README.md](README.md) for detailed documentation
- Read [Backend.md](Backend.md) for complete implementation guide
- Review API endpoints in the router configuration

## Production Deployment

When ready to deploy:

1. Build production binary: `make build-prod`
2. Set ENVIRONMENT=production in `.env`
3. Use strong JWT_SECRET
4. Enable HTTPS
5. Configure proper CORS settings
6. Set up database backups

For detailed deployment instructions, see [README.md](README.md#deployment).

---

**🎉 You're all set!** Your backend is now running and ready to handle requests from the frontend.
