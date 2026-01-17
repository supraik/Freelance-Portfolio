# Portfolio Backend - Go API Server

A high-performance RESTful API backend built with Go for the Anushree Singh Portfolio website.

## Features

- 🚀 Fast and lightweight Go API server
- 📧 **Dual Email System**:
  - ✉️ Automatic acknowledgment email to clients
  - 📬 Notification email to portfolio owner
- 🖼️ Gallery management system
- 🔐 JWT-based authentication
- 📤 File upload handling
- 🗄️ PostgreSQL database
- ✅ Input validation
- 🔒 CORS and security middleware

## Tech Stack

- **Language**: Go 1.22+
- **Web Framework**: Gin
- **Database**: PostgreSQL 15
- **Authentication**: JWT (golang-jwt)
- **Email**: SMTP
- **Validation**: go-playground/validator

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go              # Application entry point
├── internal/
│   ├── config/                  # Configuration management
│   ├── database/                # Database connection & migrations
│   ├── handlers/                # HTTP request handlers
│   ├── middleware/              # Middleware functions
│   ├── models/                  # Data models
│   ├── repository/              # Database operations
│   ├── router/                  # Route definitions
│   └── services/                # Business logic services
├── pkg/
│   ├── response/                # Standard API responses
│   └── validator/               # Input validation utilities
└── uploads/                     # Uploaded files directory
```

## Prerequisites

- Go 1.22 or later
- PostgreSQL 15 or later
- Make (optional, for using Makefile commands)

## Installation

### 1. Install Go

Download and install Go from [https://go.dev/dl/](https://go.dev/dl/)

Verify installation:
```bash
go version
```

### 2. Install PostgreSQL

**Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**macOS**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q
```

### 4. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
go mod download
go mod tidy

# Or use make
make install
```

### 5. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your values
# Update DATABASE_URL, SMTP settings, etc.
```

## Configuration

Edit `.env` file with your settings:

```env
# Server
PORT=8080
ENVIRONMENT=development

# Database
DATABASE_URL=postgres://portfolio_user:your_password@localhost:5432/portfolio_db?sslmode=disable

# JWT (generate a secure random string)
JWT_SECRET=your-very-long-and-secure-secret-key-here

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_TO=contact@anushreesingh.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Gmail App Password

For Gmail, you need to create an App Password:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to App Passwords and create one for this application

## Running the Application

### Using Go commands:

```bash
# Run the server
go run cmd/server/main.go

# Build and run
go build -o bin/server cmd/server/main.go
./bin/server
```

### Using Make:

```bash
# Run in development mode
make run

# Run with hot reload (requires air)
make dev

# Build binary
make build

# Run tests
make test

# See all commands
make help
```

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/galleries` | Get all galleries |
| GET | `/api/galleries/:slug` | Get gallery by slug |
| POST | `/api/auth/login` | Admin login |

### Protected Endpoints (Require JWT Token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/contacts` | List all contact messages |
| PATCH | `/api/admin/contacts/:id/read` | Mark message as read |
| POST | `/api/admin/galleries` | Create gallery |
| PUT | `/api/admin/galleries/:id` | Update gallery |
| DELETE | `/api/admin/galleries/:id` | Delete gallery |
| POST | `/api/admin/upload` | Upload image |

## API Usage Examples

### Submit Contact Form

```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Inquiry",
    "message": "Hello, I would like to know more about your services."
  }'
```

### Admin Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

### Get Galleries (Authenticated)

```bash
curl http://localhost:8080/api/admin/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Creating First Admin User

You need to create the first admin user manually:

```bash
# Connect to database
psql -U portfolio_user -d portfolio_db

# Hash your password first (use bcrypt online tool or write a Go script)
# Then insert the user
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@example.com', '$2a$10$hashed_password_here', 'Admin User');
```

Or use the `/api/auth/register` endpoint (if enabled in router.go).

## Development

### Hot Reload

Install Air for hot reloading:

```bash
go install github.com/air-verse/air@latest
```

Run with hot reload:

```bash
air
# or
make dev
```

### Running Tests

```bash
# Run all tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Generate coverage report
make test-coverage
```

### Code Formatting

```bash
# Format code
go fmt ./...

# Or use make
make fmt
```

## Deployment

### Build for Production

```bash
# Build optimized binary
make build-prod

# The binary will be in bin/server
```

### Docker Deployment

```bash
# Build Docker image
docker build -t portfolio-backend .

# Run container
docker run -p 8080:8080 --env-file .env portfolio-backend
```

### Using Docker Compose

From the project root:

```bash
docker-compose up -d
```

## Troubleshooting

### Database Connection Error

```
Error: failed to connect to database
```

**Solution**: 
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Ensure database and user exist

### CORS Error in Browser

```
Error: CORS policy blocked
```

**Solution**: Update `FRONTEND_URL` in `.env` to match your frontend URL

### Port Already in Use

```
Error: bind: address already in use
```

**Solution**: 
- Change `PORT` in `.env`
- Or stop the process using port 8080

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| ENVIRONMENT | Environment mode | development |
| DATABASE_URL | PostgreSQL connection string | localhost:5432 |
| JWT_SECRET | Secret key for JWT tokens | (required) |
| JWT_EXPIRATION | Token expiration time | 24h |
| SMTP_HOST | SMTP server host | smtp.gmail.com |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | SMTP username | - |
| SMTP_PASSWORD | SMTP password | - |
| EMAIL_FROM | From email address | noreply@anushreesingh.com |
| EMAIL_TO | Recipient email | contact@anushreesingh.com |
| UPLOAD_DIR | Upload directory path | ./uploads |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Database Schema

### Tables

- **contact_messages**: Contact form submissions
- **gallery_categories**: Gallery categories/albums
- **gallery_images**: Images within galleries
- **admin_users**: Admin user accounts
- **page_analytics**: Page view analytics (optional)

See [Backend.md](Backend.md) for detailed schema documentation.

## License

MIT

## Support

For issues and questions, please refer to the main project documentation in [Backend.md](Backend.md).
