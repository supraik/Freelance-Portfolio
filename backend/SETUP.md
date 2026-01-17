# Backend Setup Instructions

## Complete Step-by-Step Setup

Follow these steps to set up and run the backend successfully.

## Prerequisites

Before starting, ensure you have:

1. **Go** 1.22 or later installed ([Download](https://go.dev/dl/))
2. **PostgreSQL** 15 or later installed ([Download](https://www.postgresql.org/download/))
3. **Git** (to clone the repository)

## Step 1: Install Dependencies

From the backend folder, run:

```bash
cd backend

# Download all Go dependencies
go mod download

# Update and tidy dependencies
go mod tidy
```

This will download all required packages:
- gin-gonic/gin (web framework)
- lib/pq (PostgreSQL driver)
- golang-jwt/jwt (JWT authentication)
- go-playground/validator (input validation)
- google/uuid (UUID generation)
- joho/godotenv (environment variables)
- golang.org/x/crypto (password hashing)
- golang.org/x/term (terminal utilities)

## Step 2: Setup PostgreSQL Database

### Option A: Manual Setup

```bash
# Start PostgreSQL
# Windows: Check Services or use pgAdmin
# macOS: brew services start postgresql@15
# Linux: sudo systemctl start postgresql

# Connect to PostgreSQL
psql -U postgres

# Run these SQL commands:
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;

# Grant schema permissions (PostgreSQL 15+)
\c portfolio_db
GRANT ALL ON SCHEMA public TO portfolio_user;

# Exit psql
\q
```

### Option B: Using Docker

```bash
# From project root
docker-compose up -d postgres

# This will create:
# - Database: portfolio_db
# - User: portfolio_user
# - Password: (from .env file)
```

## Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
# Required changes:
# 1. DATABASE_URL - Update with your password
# 2. JWT_SECRET - Generate a strong random string
# 3. SMTP settings - For email functionality (optional for testing)
```

### Generating JWT Secret

Use one of these methods:

```bash
# Method 1: Using openssl
openssl rand -base64 32

# Method 2: Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Method 3: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy the output to JWT_SECRET in .env
```

### Gmail SMTP Setup (Optional)

If you want email notifications:

1. Enable 2-Step Verification in your Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Use this password in SMTP_PASSWORD (not your regular password)

## Step 4: Run Database Migrations

The migrations will run automatically when you start the server, but you can verify:

```bash
# Just run the server - it will create tables automatically
go run cmd/server/main.go
```

You should see:
```
✅ Database connected successfully
✅ Database migrations completed
🚀 Server starting on port 8080
```

## Step 5: Create Admin User

In a new terminal (keep the server running):

```bash
# From backend folder
go run scripts/create_admin.go

# Enter:
# Email: admin@example.com
# Name: Admin User
# Password: YourSecurePassword123
```

You should see:
```
✅ Admin user created successfully!
   ID: 1
   Email: admin@example.com
   Name: Admin User
```

## Step 6: Test the API

### Test 1: Health Check

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "portfolio-backend"
}
```

### Test 2: Submit Contact Form

```bash
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message to verify the contact form works."
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    ...
  }
}
```

### Test 3: Admin Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "YourSecurePassword123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User"
    }
  }
}
```

**Save the token!** You'll need it for authenticated requests.

### Test 4: Get Contact Messages (Authenticated)

Replace `YOUR_TOKEN` with the token from step 3:

```bash
curl http://localhost:8080/api/admin/contacts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "success": true,
  "message": "Messages retrieved",
  "data": [
    {
      "id": 1,
      "name": "Test User",
      "email": "test@example.com",
      ...
    }
  ]
}
```

## Troubleshooting

### Error: "failed to connect to database"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Check status
   # macOS: brew services list
   # Linux: sudo systemctl status postgresql
   # Windows: Check Services app
   ```

2. Test connection manually:
   ```bash
   psql -U portfolio_user -d portfolio_db -h localhost
   # Enter password when prompted
   ```

3. Check DATABASE_URL in `.env` matches your credentials

### Error: "could not import" packages

**Solution:**
```bash
# Clean and reinstall dependencies
rm -rf go.sum
go mod tidy
go mod download
```

### Error: "permission denied" on database

**Solution:**
```bash
# Connect to database as postgres user
psql -U postgres -d portfolio_db

# Grant all permissions
GRANT ALL ON SCHEMA public TO portfolio_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO portfolio_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO portfolio_user;
```

### Error: Port 8080 already in use

**Solution:**
```bash
# Change port in .env
PORT=8090

# Or find and stop the process using port 8080
# Windows: netstat -ano | findstr :8080
# macOS/Linux: lsof -ti:8080 | xargs kill
```

### Email notifications not working

**Solution:**
1. Email is optional - the API works without it
2. For Gmail: Use App Password, not regular password
3. Check SMTP settings in `.env`
4. Test with a simple SMTP testing tool first

## Development Tips

### Hot Reload

For automatic server restart on code changes:

```bash
# Install Air
go install github.com/air-verse/air@latest

# Run with hot reload
air
```

### VS Code Setup

Recommended extensions:
- Go (by Go Team at Google)
- REST Client (for testing APIs)

Create `.vscode/settings.json`:
```json
{
  "go.formatTool": "gofmt",
  "go.lintTool": "golangci-lint",
  "editor.formatOnSave": true
}
```

### Database GUI Tools

For easier database management:
- [pgAdmin](https://www.pgadmin.org/) - Full-featured PostgreSQL GUI
- [TablePlus](https://tableplus.com/) - Modern, lightweight GUI
- [DBeaver](https://dbeaver.io/) - Universal database tool

Or use Adminer via Docker:
```bash
docker-compose --profile dev up adminer
# Access at http://localhost:8081
```

## Next Steps

1. **Connect Frontend**: Update frontend API_URL to `http://localhost:8080/api`
2. **Test all endpoints**: Use Postman or REST Client
3. **Configure Email**: Set up SMTP for contact form notifications
4. **Secure JWT**: Use a strong random JWT_SECRET
5. **Review code**: Understand the structure and customize as needed

## Production Deployment

When ready to deploy:

1. Build production binary:
   ```bash
   make build-prod
   ```

2. Update `.env` for production:
   ```env
   ENVIRONMENT=production
   FRONTEND_URL=https://your-domain.com
   JWT_SECRET=<strong-random-value>
   ```

3. Use managed database (recommended):
   - Railway PostgreSQL
   - DigitalOcean Managed Database
   - AWS RDS
   - Supabase

4. Deploy backend:
   - Railway: `railway up`
   - Fly.io: `fly deploy`
   - Docker: `docker-compose up -d`
   - VPS: Copy binary + systemd service

See [README.md](README.md#deployment) for detailed deployment guides.

## Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Go 1.22+ installed
- [ ] Dependencies downloaded (`go mod download`)
- [ ] Database created (`portfolio_db`)
- [ ] `.env` file configured
- [ ] Server starts successfully
- [ ] Admin user created
- [ ] Health check passes
- [ ] Contact form works
- [ ] Login works and returns token
- [ ] Protected endpoints work with token

**If all items are checked, you're ready to go! 🎉**

## Getting Help

- Read [Backend.md](Backend.md) for detailed implementation guide
- Check [README.md](README.md) for API documentation
- Review [QUICKSTART.md](QUICKSTART.md) for quick reference

---

**Questions or issues?** Review the troubleshooting section or check the error messages carefully - they usually point to the exact problem.
