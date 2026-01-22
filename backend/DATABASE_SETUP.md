# Database Setup - Local PostgreSQL

## Overview

This portfolio backend uses **PostgreSQL** installed locally for development. You'll deploy to a cloud database later when ready for production.

**Current Setup:** Local PostgreSQL installation
**Future:** Deploy to Neon, Supabase, Railway, or other cloud provider

## Why Local First?

- ✅ **Full Control** - Complete access to your database
- ✅ **No Internet Required** - Work offline
- ✅ **Learn PostgreSQL** - Understand database operations
- ✅ **Free** - No usage limits or costs
- ✅ **Easy to Deploy Later** - Simple migration to cloud

## Quick Start - Windows

### 1. Download PostgreSQL

1. Visit [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Download the installer (Version 16 recommended)
3. Run the installer

### 2. Installation Steps

During installation:

1. **Installation Directory**: Use default (`C:\Program Files\PostgreSQL\16`)
2. **Components**: 
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Command Line Tools
   - ✅ Stack Builder (optional)
3. **Data Directory**: Use default
4. **Password**: Set a strong password for the `postgres` superuser
   - ⚠️ **Remember this password!** You'll need it later
5. **Port**: Use default `5432`
6. **Locale**: Use default

### 3. Create Database

**Option A: Using pgAdmin (GUI)**

1. Open pgAdmin 4
2. Connect to PostgreSQL (enter your password)
3. Right-click **"Databases"** → **"Create"** → **"Database"**
4. Enter database name: `portfolio_db`
5. Click **"Save"**

**Option B: Using Command Line**

```bash
# Open Command Prompt or PowerShell
psql -U postgres

# Enter your password when prompted
# Then create database:
CREATE DATABASE portfolio_db;

# Exit psql:
\q
```

### 4. Configure Backend

Create/update `backend/.env`:

```env
# Database Configuration (Local PostgreSQL)
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/portfolio_db?sslmode=disable

# Note: Replace 'your-password' with your PostgreSQL password
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
postgresql://[username]:[password]@[host]:[port]/[database]?[parameters]
```

**Components:**
- **username**: Database user (`postgres` by default)
- **password**: Your PostgreSQL password (set during installation)
- **host**: `localhost` (your local machine)
- **port**: `5432` (default PostgreSQL port)
- **database**: Database name (`portfolio_db`)
- **parameters**: `sslmode=disable` (SSL not needed locally)

## Working with Your Local Database

### Using pgAdmin 4 (GUI Tool)

pgAdmin is installed with PostgreSQL and provides a visual interface:

1. **Open pgAdmin 4**
2. **Connect** to PostgreSQL server (localhost)
3. **Navigate**: Servers → PostgreSQL 16 → Databases → portfolio_db
4. **Query Tool**: Tools → Query Tool (or F5)

**Useful pgAdmin Features:**
- **Browse Tables**: Expand Schemas → public → Tables
- **View Data**: Right-click table → View/Edit Data
- **Run Queries**: Use Query Tool for SQL commands
- **Backup/Restore**: Right-click database → Backup/Restore

### Using psql (Command Line)

Connect to your database:

```bash
# Connect to portfolio_db
psql -U postgres -d portfolio_db

# Or use connection string
psql "postgresql://postgres:your-password@localhost:5432/portfolio_db"
```

**Useful psql commands:**
```sql
\l              -- List all databases
\c portfolio_db -- Connect to portfolio_db
\dt             -- List all tables
\d table_name   -- Describe table structure
\q              -- Quit psql
```

## Monitoring Your Database

### Check Database Size

```sql
SELECT 
    pg_size_pretty(pg_database_size('portfolio_db')) AS database_size;
```

### View Table Information

```sql
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active Connections

```sql
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query
FROM pg_stat_activity
WHERE datname = 'portfolio_db';
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
psql -U postgres -d portfolio_db
# Or
psql "postgresql://postgres:your-password@localhost:5432/portfolio_db"
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

**Create Backup:**

```bash
# Using pg_dump
pg_dump -U postgres -d portfolio_db > backup.sql

# With password (interactive)
pg_dump -U postgres -d portfolio_db -F c -f backup.dump

# Or with connection string
pg_dump "postgresql://postgres:password@localhost:5432/portfolio_db" > backup.sql
```

**Restore Backup:**

```bash
# From SQL file
psql -U postgres -d portfolio_db < backup.sql

# From custom format
pg_restore -U postgres -d portfolio_db backup.dump
```

**Automated Backup Script (PowerShell):**

```powershell
# backup.ps1
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$filename = "portfolio_backup_$timestamp.sql"
pg_dump -U postgres -d portfolio_db > "backups\$filename"
Write-Host "Backup created: $filename"
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
# Check if PostgreSQL is running
# Open Services (services.msc) and look for "postgresql-x64-16"
# Or use PowerShell:
Get-Service -Name postgresql*

# Start if stopped:
Start-Service postgresql-x64-16

# Check connection string
echo $env:DATABASE_URL
```

**Error:** `password authentication failed`
```bash
# Verify password in .env matches PostgreSQL password
# To reset PostgreSQL password:
psql -U postgres
ALTER USER postgres PASSWORD 'new-password';
\q

# Update DATABASE_URL in .env
```

**Error:** `database "portfolio_db" does not exist`
```bash
# Create the database
psql -U postgres
CREATE DATABASE portfolio_db;
\q
```

**Error:** `psql: command not found`
```bash
# Add PostgreSQL to PATH
# Add to System Environment Variables:
# C:\Program Files\PostgreSQL\16\bin

# Or restart PowerShell/Command Prompt
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
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
SELECT pg_reload_conf();

-- View slow queries
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Check Indexes:**
```sql
-- List all indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public';
```

**Too Many Connections:**
```sql
-- Check max connections
SHOW max_connections;

-- View current connections
SELECT count(*) FROM pg_stat_activity;
```

```go
// Reduce connection pool size in code
db.SetMaxOpenConns(10)  // Lower from 25
db.SetMaxIdleConns(2)   // Lower from 5
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

### 3. Use SSL in Production Only

For local development:
```
?sslmode=disable
```

For production (cloud databases):
```
?sslmode=require
```

### 4. Secure Your PostgreSQL Installation

**Set strong password:**
```sql
ALTER USER postgres PASSWORD 'very-strong-password-123!';
```

**Restrict network access** (in `pg_hba.conf`):
```
# Only allow local connections
host    all    all    127.0.0.1/32    md5
```

### 5. Rotate Passwords Regularly

Update password and `.env` file periodically.

### 5. Limit Permissions

Create read-only users for non-admin access:
```sql
CREATE USER readonly WITH PASSWORD 'secure-password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

## Local Development Checklist

- [ ] PostgreSQL installed on Windows
- [ ] Database `portfolio_db` created
- [ ] Connection string added to `backend/.env`
- [ ] Backend server connects successfully
- [ ] Migrations run and tables created
- [ ] pgAdmin 4 installed and accessible
- [ ] Test contact form submission works
- [ ] Backup strategy planned
- [ ] PostgreSQL service runs on startup
- [ ] Connection pooling configured

## When Ready to Deploy

### Migration Path: Local → Cloud Database

When you're ready for production, you have several options:

#### Option 1: Neon (Serverless PostgreSQL)
- **Pros**: Free tier, auto-scaling, zero maintenance
- **Setup**: 5 minutes
- **Cost**: Free tier → $19/mo for production

1. Sign up at [neon.tech](https://neon.tech)
2. Create project, get connection string
3. Export local data: `pg_dump -U postgres portfolio_db > export.sql`
4. Import to Neon: `psql "neon-connection-string" < export.sql`
5. Update `DATABASE_URL` in production environment

#### Option 2: Supabase (PostgreSQL + Features)
- **Pros**: Free tier, includes auth/storage/realtime
- **Setup**: 5 minutes
- **Cost**: Free tier → $25/mo for production

1. Sign up at [supabase.com](https://supabase.com)
2. Create project, get connection string
3. Export/import data same as above
4. Update `DATABASE_URL` in production

#### Option 3: Railway (Full Platform)
- **Pros**: Easy deployment, includes hosting
- **Setup**: 10 minutes
- **Cost**: $5/mo credit → pay as you go

1. Sign up at [railway.app](https://railway.app)
2. Create PostgreSQL service
3. Deploy your backend
4. Automatic migration on deploy

#### Option 4: Render (PostgreSQL Managed)
- **Pros**: Free tier, simple pricing
- **Setup**: 5 minutes
- **Cost**: Free tier → $7/mo for production

1. Sign up at [render.com](https://render.com)
2. Create PostgreSQL database
3. Export/import data
4. Deploy backend service

### Data Migration Steps

```bash
# 1. Backup local database
pg_dump -U postgres -d portfolio_db > production_export.sql

# 2. Connect to cloud database
psql "your-cloud-database-connection-string"

# 3. Import data
\i production_export.sql

# 4. Verify migration
SELECT COUNT(*) FROM contact_messages;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM galleries;

# 5. Update environment variables in production
DATABASE_URL=your-cloud-database-url
```

### Zero-Downtime Migration

1. Keep local database running
2. Set up cloud database
3. Export and import data
4. Test cloud database connection
5. Update production `DATABASE_URL`
6. Monitor for issues
7. Keep local backup for rollback if needed

## Summary

**Current Setup (Development):**
1. **Install PostgreSQL** on Windows
2. **Create database** `portfolio_db` using pgAdmin or psql
3. **Configure** `backend/.env` with local connection string
4. **Run backend** → Migrations create tables automatically
5. **Use pgAdmin** for visual database management

**When Ready for Production:**
1. Choose cloud provider (Neon, Supabase, Railway, or Render)
2. Export local data with `pg_dump`
3. Import to cloud database
4. Update `DATABASE_URL` in production environment
5. Deploy and monitor

Your database is now ready for local development! The backend will automatically:
- Connect to your local PostgreSQL
- Create all tables via migrations
- Handle all CRUD operations
- Manage connections efficiently

**Next Steps:**
1. Start building and testing locally
2. Learn PostgreSQL with pgAdmin
3. Create regular backups
4. When ready, migrate to cloud database for production

For PostgreSQL help: [PostgreSQL Documentation](https://www.postgresql.org/docs/) or [pgAdmin Docs](https://www.pgadmin.org/docs/)
