# Database Setup - Neon Serverless PostgreSQL

## Overview

This portfolio backend uses **Neon** - a serverless PostgreSQL database that offers:

- ✅ **Serverless Architecture** - Auto-scaling and pay-per-use
- ✅ **Free Tier** - Perfect for development and small projects
- ✅ **Instant Provisioning** - Database ready in seconds
- ✅ **Branching** - Create database branches like Git
- ✅ **Auto-Suspend** - Saves costs when inactive
- ✅ **PostgreSQL Compatible** - Full SQL support

## Why Neon?

| Feature | Neon | Traditional PostgreSQL |
|---------|------|----------------------|
| Setup Time | < 1 minute | Hours |
| Scaling | Automatic | Manual |
| Cost (Idle) | $0 | Server costs |
| Branching | Native | Manual backups |
| Maintenance | Zero | Regular updates |

## Quick Start

### 1. Create Neon Account

1. Visit [neon.tech](https://neon.tech)
2. Sign up with GitHub or Google
3. Verify your email

### 2. Create a New Project

1. Click **"New Project"**
2. Configure your project:
   - **Name**: `portfolio-backend`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (recommended)
3. Click **"Create Project"**

### 3. Get Connection String

After project creation, you'll see your connection string:

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:abc123xyz@ep-cool-meadow-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 4. Configure Backend

Copy your connection string to `.env`:

```env
# Database Configuration (Neon)
DATABASE_URL=postgresql://neondb_owner:your-password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 5. Test Connection

Run the backend:

```bash
cd backend
go run cmd/server/main.go
```

You should see:
```
✅ Connected to database successfully
✅ Migrations completed
🚀 Server starting on port 8080
```

## Database Schema

### Tables Created by Migrations

The backend automatically creates these tables:

#### 1. `contact_messages`
Stores contact form submissions

```sql
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_contact_status ON contact_messages(status);
CREATE INDEX idx_contact_created ON contact_messages(created_at DESC);
```

#### 2. `users`
Admin user accounts

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `galleries`
Photo gallery categories

```sql
CREATE TABLE galleries (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    cover_image VARCHAR(255),
    image_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. `gallery_images`
Individual photos in galleries

```sql
CREATE TABLE gallery_images (
    id SERIAL PRIMARY KEY,
    gallery_id INTEGER REFERENCES galleries(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

### Complete Database Configuration

```env
# Database (Neon Serverless PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# Optional: Connection Pool Settings
DB_MAX_OPEN_CONNS=25
DB_MAX_IDLE_CONNS=5
DB_CONN_MAX_LIFETIME=5m
```

### Connection String Format

```
postgresql://[username]:[password]@[host]/[database]?[parameters]
```

**Components:**
- **username**: Database user (usually `neondb_owner`)
- **password**: Your database password
- **host**: Neon endpoint (e.g., `ep-xxx.us-east-1.aws.neon.tech`)
- **database**: Database name (usually `neondb`)
- **parameters**: `sslmode=require` (required for Neon)

## Neon Dashboard Features

### 1. SQL Editor

Run queries directly in the dashboard:

```sql
-- View all contact messages
SELECT * FROM contact_messages ORDER BY created_at DESC;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public';
```

### 2. Monitoring

- **Queries**: Track slow queries
- **Connections**: Active database connections
- **Storage**: Database size and usage
- **Compute**: CPU and memory usage

### 3. Branching

Create database branches for testing:

```bash
# Create branch from main
neon branches create --name staging

# Get branch connection string
neon connection-string staging
```

Use different connection strings for environments:
```env
# Development
DATABASE_URL=postgresql://...@ep-main-123.neon.tech/neondb

# Staging
DATABASE_URL=postgresql://...@ep-staging-456.neon.tech/neondb
```

## Migrations System

### How Migrations Work

Located in `internal/database/migrations/`:

```
migrations/
├── 001_init.up.sql      # Creates initial tables
└── 001_init.down.sql    # Rolls back changes
```

### Running Migrations

Migrations run automatically on server start:

```go
// cmd/server/main.go
if err := database.Migrate(db); err != nil {
    log.Fatalf("Failed to run migrations: %v", err)
}
```

### Creating New Migration

1. Create migration files:
```bash
# In backend/internal/database/migrations/
touch 002_add_featured_galleries.up.sql
touch 002_add_featured_galleries.down.sql
```

2. Write up migration:
```sql
-- 002_add_featured_galleries.up.sql
ALTER TABLE galleries ADD COLUMN is_featured BOOLEAN DEFAULT false;
CREATE INDEX idx_galleries_featured ON galleries(is_featured);
```

3. Write down migration:
```sql
-- 002_add_featured_galleries.down.sql
DROP INDEX IF EXISTS idx_galleries_featured;
ALTER TABLE galleries DROP COLUMN IF EXISTS is_featured;
```

4. Restart server - migration runs automatically

## Testing Database Connection

### Test Connection from Code

```go
package main

import (
    "database/sql"
    "fmt"
    "log"
    _ "github.com/lib/pq"
)

func main() {
    connStr := "postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require"
    
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()
    
    if err := db.Ping(); err != nil {
        log.Fatal(err)
    }
    
    fmt.Println("✅ Database connection successful!")
}
```

### Test from Command Line

Using `psql`:

```bash
psql "postgresql://neondb_owner:password@ep-xxx.neon.tech/neondb?sslmode=require"
```

Using Go:
```bash
cd backend
go run cmd/server/main.go
```

## Database Operations

### Viewing Data

```sql
-- All contact messages
SELECT id, name, email, subject, status, created_at 
FROM contact_messages 
ORDER BY created_at DESC;

-- Pending messages only
SELECT * FROM contact_messages WHERE status = 'pending';

-- Message statistics
SELECT 
    status,
    COUNT(*) as count,
    MAX(created_at) as latest
FROM contact_messages
GROUP BY status;
```

### Manual Data Entry

```sql
-- Create test contact message
INSERT INTO contact_messages (name, email, subject, message)
VALUES 
    ('John Doe', 'john@example.com', 'Test Inquiry', 'This is a test message');

-- Create admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role)
VALUES 
    ('admin', 'admin@anushreesingh.com', '$2a$10$...', 'admin');
```

### Backup & Restore

Neon automatically backs up your database. To manually export:

```bash
# Export database
pg_dump "postgresql://..." > backup.sql

# Import database
psql "postgresql://..." < backup.sql
```

## Connection Pooling

### Configure in Code

```go
// internal/database/database.go
func Connect(databaseURL string) (*sql.DB, error) {
    db, err := sql.Open("postgres", databaseURL)
    if err != nil {
        return nil, err
    }

    // Connection pool settings
    db.SetMaxOpenConns(25)        // Max connections
    db.SetMaxIdleConns(5)         // Idle connections
    db.SetConnMaxLifetime(5 * time.Minute)

    if err := db.Ping(); err != nil {
        return nil, err
    }

    return db, nil
}
```

## Troubleshooting

### Connection Issues

**Error:** `connection refused`
```bash
# Check connection string
echo $DATABASE_URL

# Verify SSL mode is set
# Neon requires: ?sslmode=require
```

**Error:** `password authentication failed`
```bash
# Reset password in Neon dashboard
# Settings → Reset Password
# Update DATABASE_URL in .env
```

**Error:** `database does not exist`
```bash
# Use default database name (usually "neondb")
# Or create new database in Neon console
```

### Migration Failures

**Error:** `migration already exists`
```sql
-- Check migration state
SELECT * FROM schema_migrations;

-- Manual rollback if needed
DROP TABLE IF EXISTS contact_messages;
```

**Error:** `table already exists`
```bash
# Drop and recreate tables
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Restart server to re-run migrations
```

### Performance Issues

**Slow Queries:**
```sql
-- Enable query logging in code
-- Or use Neon dashboard → Queries tab
```

**Too Many Connections:**
```go
// Reduce connection pool size
db.SetMaxOpenConns(10)  // Lower from 25
```

## Security Best Practices

### 1. Never Commit Credentials

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. Use Environment Variables

```bash
# Development
export DATABASE_URL="postgresql://..."

# Production (use secrets manager)
```

### 3. Enable SSL

Always use `sslmode=require` for Neon:
```
?sslmode=require
```

### 4. Rotate Passwords

Regularly reset database password in Neon dashboard.

### 5. Limit Permissions

Create read-only users for non-admin access:
```sql
CREATE USER readonly WITH PASSWORD 'secure-password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

## Production Checklist

- [ ] Database created on Neon
- [ ] Connection string added to `.env`
- [ ] SSL mode enabled (`sslmode=require`)
- [ ] Migrations tested and working
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Monitoring enabled in Neon dashboard
- [ ] Credentials stored securely (not in code)
- [ ] Database indexed properly
- [ ] Query performance tested

## Neon Free Tier Limits

| Resource | Free Tier | Notes |
|----------|-----------|-------|
| Storage | 0.5 GB | Enough for most portfolios |
| Compute | 100 hours/month | Auto-suspends when idle |
| Branches | 10 | Great for testing |
| Projects | Unlimited | One per environment |
| Data Transfer | 5 GB/month | Plenty for API usage |

**Upgrade if needed:** Pro plan starts at $19/month

## Alternative Database Options

If you prefer other options:

### 1. Supabase (PostgreSQL)
```env
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
```

### 2. Railway (PostgreSQL)
```env
DATABASE_URL=postgresql://postgres:[password]@containers-us-west-xxx.railway.app:7432/railway
```

### 3. Render (PostgreSQL)
```env
DATABASE_URL=postgresql://user:pass@dpg-xxx-a.oregon-postgres.render.com/database
```

All work the same way - just update `DATABASE_URL` in `.env`

## Summary

1. **Sign up** at [neon.tech](https://neon.tech)
2. **Create project** → Get connection string
3. **Add to `.env`** → `DATABASE_URL=postgresql://...`
4. **Run backend** → Migrations create tables automatically
5. **Test** → Submit contact form, check database

Your database is now ready! The backend will automatically:
- Connect to Neon
- Create all tables
- Handle all CRUD operations
- Manage connections efficiently

For support: [Neon Discord](https://discord.gg/neon) or [Documentation](https://neon.tech/docs)
