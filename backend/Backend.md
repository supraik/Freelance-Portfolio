# Backend Development with Go (Golang) - End-to-End Guide

## Complete Integration Guide for Anushree Singh Portfolio

> **For Beginners**: This guide assumes zero knowledge of Go. You'll learn everything from installation to deployment.

---

## Table of Contents

1. [Introduction to Go Backend](#1-introduction-to-go-backend)
2. [Why Go for This Project](#2-why-go-for-this-project)
3. [Development Environment Setup](#3-development-environment-setup)
4. [Go Language Fundamentals](#4-go-language-fundamentals)
5. [Backend Project Structure](#5-backend-project-structure)
6. [Building the API Server](#6-building-the-api-server)
7. [Database Integration](#7-database-integration)
8. [API Endpoints Implementation](#8-api-endpoints-implementation)
9. [Authentication & Security](#9-authentication--security)
10. [File Upload Handling](#10-file-upload-handling)
11. [Email Service Integration](#11-email-service-integration)
12. [Frontend-Backend Integration](#12-frontend-backend-integration)
13. [Testing Your Backend](#13-testing-your-backend)
14. [Deployment Guide](#14-deployment-guide)
15. [Troubleshooting](#15-troubleshooting)
16. [Quick Reference Cheatsheet](#16-quick-reference-cheatsheet)

---

## 1. Introduction to Go Backend

### What is Go?

Go (also called Golang) is a programming language created by Google. It's designed for:
- **Simplicity**: Easy to learn and read
- **Speed**: Compiles to machine code, very fast execution
- **Concurrency**: Handles multiple tasks simultaneously with ease
- **Reliability**: Strong typing catches errors at compile time

### What Will This Backend Do?

```
┌─────────────────────────────────────────────────────────────────┐
│                     PORTFOLIO BACKEND                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Contact    │    │   Gallery    │    │    Admin     │       │
│  │    Form      │    │  Management  │    │    Panel     │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                   │                │
│         ▼                   ▼                   ▼                │
│  ┌─────────────────────────────────────────────────────┐        │
│  │                    GO API SERVER                     │        │
│  │            (Handles all requests)                    │        │
│  └─────────────────────────┬───────────────────────────┘        │
│                            │                                     │
│         ┌──────────────────┼──────────────────┐                 │
│         ▼                  ▼                  ▼                 │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐            │
│  │  Database  │    │   Email    │    │   File     │            │
│  │ PostgreSQL │    │  Service   │    │  Storage   │            │
│  └────────────┘    └────────────┘    └────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Features We'll Build

| Feature | Description | Endpoint |
|---------|-------------|----------|
| Contact Form | Receive and store messages | `POST /api/contact` |
| Gallery Management | CRUD for gallery images | `/api/galleries/*` |
| Image Upload | Handle photo uploads | `POST /api/upload` |
| Email Notifications | Send contact form emails | Internal service |
| Admin Authentication | Secure admin access | `/api/auth/*` |
| Analytics | Track page views | `POST /api/analytics` |

---

## 2. Why Go for This Project

### Comparison with Other Options

| Feature | Go | Node.js | Python | PHP |
|---------|-----|---------|--------|-----|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Learning Curve | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Deployment | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Concurrency | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| Type Safety | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |

### Benefits for Portfolio Backend

1. **Single Binary Deployment**: Compile once, run anywhere
2. **Low Resource Usage**: Minimal memory and CPU
3. **Built-in HTTP Server**: No need for Apache/Nginx for development
4. **Excellent for APIs**: First-class JSON support
5. **Great Tooling**: Formatting, testing, and documentation built-in

---

## 3. Development Environment Setup

### Step 1: Install Go

#### Windows

```powershell
# Option 1: Download installer from https://go.dev/dl/
# Run the .msi installer

# Option 2: Using Chocolatey
choco install golang

# Option 3: Using Winget
winget install GoLang.Go
```

#### macOS

```bash
# Option 1: Download from https://go.dev/dl/
# Run the .pkg installer

# Option 2: Using Homebrew
brew install go
```

#### Linux (Ubuntu/Debian)

```bash
# Download and install
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

### Step 2: Verify Installation

```bash
# Check Go version
go version
# Expected output: go version go1.22.0 linux/amd64 (or similar)

# Check Go environment
go env
# Shows all Go environment variables
```

### Step 3: Install Required Tools

```bash
# Install VS Code extensions (recommended IDE)
# - Go (by Go Team at Google)
# - Go Test Explorer
# - REST Client (for API testing)

# Install Go tools
go install golang.org/x/tools/gopls@latest          # Language server
go install github.com/air-verse/air@latest          # Hot reload
go install github.com/swaggo/swag/cmd/swag@latest   # API documentation
```

### Step 4: Install PostgreSQL

#### Windows

```powershell
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey
choco install postgresql
```

#### macOS

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 5: Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q
```

---

## 4. Go Language Fundamentals

> **Learn These Basics Before Proceeding**

### 4.1 Variables and Types

```go
package main

import "fmt"

func main() {
    // Variable declaration
    var name string = "Anushree Singh"
    var age int = 25
    var isModel bool = true
    
    // Short declaration (preferred)
    email := "contact@anushreesingh.com"
    rating := 4.9
    
    // Constants
    const SITE_NAME = "Anushree Singh Portfolio"
    
    fmt.Println(name, email)
}
```

### 4.2 Data Structures

```go
// Struct (like a class in other languages)
type ContactMessage struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    Subject   string    `json:"subject"`
    Message   string    `json:"message"`
    CreatedAt time.Time `json:"created_at"`
}

// Slice (dynamic array)
messages := []ContactMessage{}

// Map (key-value pairs)
categories := map[string]int{
    "wedding": 45,
    "saree":   30,
    "makeup":  25,
}
```

### 4.3 Functions

```go
// Basic function
func greet(name string) string {
    return "Hello, " + name
}

// Multiple return values
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

// Method on a struct
func (c *ContactMessage) Validate() error {
    if c.Email == "" {
        return errors.New("email is required")
    }
    return nil
}
```

### 4.4 Error Handling

```go
// Go uses explicit error handling (no exceptions)
result, err := someFunction()
if err != nil {
    // Handle error
    log.Printf("Error occurred: %v", err)
    return err
}
// Use result
```

### 4.5 HTTP Basics

```go
package main

import (
    "encoding/json"
    "net/http"
)

func main() {
    // Route handler
    http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
        // Set response header
        w.Header().Set("Content-Type", "application/json")
        
        // Write response
        json.NewEncoder(w).Encode(map[string]string{
            "message": "Hello, World!",
        })
    })
    
    // Start server
    http.ListenAndServe(":8080", nil)
}
```

---

## 5. Backend Project Structure

### Create the Backend Directory

```bash
# From the root of your portfolio project
mkdir -p backend
cd backend

# Initialize Go module
go mod init github.com/yourusername/portfolio-backend
```

### Complete Project Structure

```
portfolio-project/
├── src/                          # React frontend (existing)
├── public/                       # Static assets (existing)
├── backend/                      # NEW: Go backend
│   ├── cmd/
│   │   └── server/
│   │       └── main.go           # Application entry point
│   │
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go         # Configuration management
│   │   │
│   │   ├── database/
│   │   │   ├── database.go       # Database connection
│   │   │   └── migrations/       # SQL migration files
│   │   │       ├── 001_init.up.sql
│   │   │       └── 001_init.down.sql
│   │   │
│   │   ├── handlers/
│   │   │   ├── contact.go        # Contact form handlers
│   │   │   ├── gallery.go        # Gallery handlers
│   │   │   ├── upload.go         # File upload handlers
│   │   │   └── auth.go           # Authentication handlers
│   │   │
│   │   ├── middleware/
│   │   │   ├── cors.go           # CORS middleware
│   │   │   ├── auth.go           # Auth middleware
│   │   │   └── logging.go        # Request logging
│   │   │
│   │   ├── models/
│   │   │   ├── contact.go        # Contact message model
│   │   │   ├── gallery.go        # Gallery models
│   │   │   └── user.go           # User model
│   │   │
│   │   ├── repository/
│   │   │   ├── contact_repo.go   # Contact database operations
│   │   │   └── gallery_repo.go   # Gallery database operations
│   │   │
│   │   ├── services/
│   │   │   ├── email.go          # Email service
│   │   │   └── storage.go        # File storage service
│   │   │
│   │   └── router/
│   │       └── router.go         # Route definitions
│   │
│   ├── pkg/
│   │   ├── validator/
│   │   │   └── validator.go      # Input validation utilities
│   │   └── response/
│   │       └── response.go       # Standard API responses
│   │
│   ├── uploads/                  # Uploaded files directory
│   │
│   ├── .env.example              # Environment variables template
│   ├── .env                      # Local environment variables (git ignored)
│   ├── go.mod                    # Go module definition
│   ├── go.sum                    # Dependency checksums
│   ├── Makefile                  # Build and run commands
│   └── Dockerfile                # Container configuration
│
├── README.md                     # Frontend documentation
├── BACKEND_DEVELOPMENT_GOLANG.md # This file
└── package.json                  # Frontend dependencies
```

---

## 6. Building the API Server

### 6.1 Entry Point (cmd/server/main.go)

```go
// backend/cmd/server/main.go
package main

import (
    "log"
    "os"
    "os/signal"
    "syscall"

    "github.com/yourusername/portfolio-backend/internal/config"
    "github.com/yourusername/portfolio-backend/internal/database"
    "github.com/yourusername/portfolio-backend/internal/router"
)

func main() {
    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("Failed to load config: %v", err)
    }

    // Initialize database
    db, err := database.Connect(cfg.DatabaseURL)
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }
    defer db.Close()

    // Run migrations
    if err := database.Migrate(db); err != nil {
        log.Fatalf("Failed to run migrations: %v", err)
    }

    // Initialize router
    r := router.New(db, cfg)

    // Start server in goroutine
    go func() {
        log.Printf("🚀 Server starting on port %s", cfg.Port)
        if err := r.Run(":" + cfg.Port); err != nil {
            log.Fatalf("Failed to start server: %v", err)
        }
    }()

    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    log.Println("Shutting down server...")
}
```

### 6.2 Configuration (internal/config/config.go)

```go
// backend/internal/config/config.go
package config

import (
    "os"

    "github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
    // Server
    Port        string
    Environment string

    // Database
    DatabaseURL string

    // JWT
    JWTSecret     string
    JWTExpiration string

    // Email
    SMTPHost     string
    SMTPPort     string
    SMTPUser     string
    SMTPPassword string
    EmailFrom    string
    EmailTo      string

    // Storage
    UploadDir   string
    MaxFileSize int64

    // Frontend
    FrontendURL string
}

// Load reads configuration from environment variables
func Load() (*Config, error) {
    // Load .env file (ignore error if not exists)
    godotenv.Load()

    return &Config{
        // Server
        Port:        getEnv("PORT", "8080"),
        Environment: getEnv("ENVIRONMENT", "development"),

        // Database
        DatabaseURL: getEnv("DATABASE_URL", "postgres://portfolio_user:password@localhost:5432/portfolio_db?sslmode=disable"),

        // JWT
        JWTSecret:     getEnv("JWT_SECRET", "your-super-secret-key-change-in-production"),
        JWTExpiration: getEnv("JWT_EXPIRATION", "24h"),

        // Email
        SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
        SMTPPort:     getEnv("SMTP_PORT", "587"),
        SMTPUser:     getEnv("SMTP_USER", ""),
        SMTPPassword: getEnv("SMTP_PASSWORD", ""),
        EmailFrom:    getEnv("EMAIL_FROM", "noreply@anushreesingh.com"),
        EmailTo:      getEnv("EMAIL_TO", "contact@anushreesingh.com"),

        // Storage
        UploadDir:   getEnv("UPLOAD_DIR", "./uploads"),
        MaxFileSize: 10 * 1024 * 1024, // 10MB

        // Frontend
        FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
    }, nil
}

// getEnv reads an environment variable with a fallback default
func getEnv(key, defaultValue string) string {
    if value, exists := os.LookupEnv(key); exists {
        return value
    }
    return defaultValue
}
```

### 6.3 Environment Variables (.env.example)

```bash
# backend/.env.example
# Copy this file to .env and fill in your values

# Server Configuration
PORT=8080
ENVIRONMENT=development

# Database
DATABASE_URL=postgres://portfolio_user:your_password@localhost:5432/portfolio_db?sslmode=disable

# JWT Authentication
JWT_SECRET=your-very-long-and-secure-secret-key-here
JWT_EXPIRATION=24h

# Email Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@anushreesingh.com
EMAIL_TO=contact@anushreesingh.com

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 6.4 Install Dependencies

```bash
cd backend

# Web framework (Gin - popular and fast)
go get github.com/gin-gonic/gin

# Database driver
go get github.com/lib/pq

# Environment variables
go get github.com/joho/godotenv

# JWT authentication
go get github.com/golang-jwt/jwt/v5

# Password hashing
go get golang.org/x/crypto/bcrypt

# Input validation
go get github.com/go-playground/validator/v10

# UUID generation
go get github.com/google/uuid

# Verify all dependencies
go mod tidy
```

---

## 7. Database Integration

### 7.1 Database Connection (internal/database/database.go)

```go
// backend/internal/database/database.go
package database

import (
    "database/sql"
    "fmt"
    "log"
    "time"

    _ "github.com/lib/pq"
)

// Connect establishes a connection to PostgreSQL
func Connect(databaseURL string) (*sql.DB, error) {
    db, err := sql.Open("postgres", databaseURL)
    if err != nil {
        return nil, fmt.Errorf("failed to open database: %w", err)
    }

    // Configure connection pool
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(5 * time.Minute)

    // Test connection
    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("failed to ping database: %w", err)
    }

    log.Println("✅ Database connected successfully")
    return db, nil
}

// Migrate runs database migrations
func Migrate(db *sql.DB) error {
    migrations := []string{
        `CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            subject VARCHAR(255),
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS gallery_categories (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(100) UNIQUE NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            cover_image VARCHAR(500),
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS gallery_images (
            id SERIAL PRIMARY KEY,
            category_id INT REFERENCES gallery_categories(id) ON DELETE CASCADE,
            src VARCHAR(500) NOT NULL,
            alt VARCHAR(255),
            aspect_ratio VARCHAR(20) DEFAULT 'portrait',
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS admin_users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS page_analytics (
            id SERIAL PRIMARY KEY,
            page_path VARCHAR(255) NOT NULL,
            visitor_id VARCHAR(100),
            user_agent TEXT,
            referrer VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC)`,
        `CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category_id)`,
        `CREATE INDEX IF NOT EXISTS idx_page_analytics_path ON page_analytics(page_path)`,
    }

    for i, migration := range migrations {
        _, err := db.Exec(migration)
        if err != nil {
            return fmt.Errorf("migration %d failed: %w", i+1, err)
        }
    }

    log.Println("✅ Database migrations completed")
    return nil
}
```

### 7.2 Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐         ┌─────────────────────┐                │
│  │  contact_messages   │         │  gallery_categories │                │
│  ├─────────────────────┤         ├─────────────────────┤                │
│  │ id (PK)             │         │ id (PK)             │                │
│  │ name                │         │ slug (UNIQUE)       │                │
│  │ email               │         │ title               │                │
│  │ subject             │         │ description         │                │
│  │ message             │    ┌────│ cover_image         │                │
│  │ is_read             │    │    │ display_order       │                │
│  │ created_at          │    │    │ created_at          │                │
│  └─────────────────────┘    │    │ updated_at          │                │
│                              │    └─────────────────────┘                │
│                              │              │                            │
│                              │              │ 1:N                        │
│                              │              ▼                            │
│  ┌─────────────────────┐    │    ┌─────────────────────┐                │
│  │    admin_users      │    │    │   gallery_images    │                │
│  ├─────────────────────┤    │    ├─────────────────────┤                │
│  │ id (PK)             │    │    │ id (PK)             │                │
│  │ email (UNIQUE)      │    │    │ category_id (FK)────┘                │
│  │ password_hash       │    │    │ src                                  │
│  │ name                │    │    │ alt                                  │
│  │ created_at          │    │    │ aspect_ratio                         │
│  │ last_login          │    │    │ display_order                        │
│  └─────────────────────┘    │    │ created_at                           │
│                              │    └─────────────────────┘                │
│                              │                                           │
│  ┌─────────────────────┐    │                                           │
│  │   page_analytics    │    │                                           │
│  ├─────────────────────┤    │                                           │
│  │ id (PK)             │    │                                           │
│  │ page_path           │    │                                           │
│  │ visitor_id          │    │                                           │
│  │ user_agent          │    │                                           │
│  │ referrer            │    │                                           │
│  │ created_at          │    │                                           │
│  └─────────────────────┘    │                                           │
│                              │                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. API Endpoints Implementation

### 8.1 Models (internal/models/)

```go
// backend/internal/models/contact.go
package models

import "time"

// ContactMessage represents a message from the contact form
type ContactMessage struct {
    ID        int       `json:"id"`
    Name      string    `json:"name" validate:"required,min=2,max=100"`
    Email     string    `json:"email" validate:"required,email"`
    Subject   string    `json:"subject" validate:"max=255"`
    Message   string    `json:"message" validate:"required,min=10,max=5000"`
    IsRead    bool      `json:"is_read"`
    CreatedAt time.Time `json:"created_at"`
}

// ContactRequest is the incoming request body
type ContactRequest struct {
    Name    string `json:"name" validate:"required,min=2,max=100"`
    Email   string `json:"email" validate:"required,email"`
    Subject string `json:"subject" validate:"max=255"`
    Message string `json:"message" validate:"required,min=10,max=5000"`
}
```

```go
// backend/internal/models/gallery.go
package models

import "time"

// GalleryCategory represents a gallery category
type GalleryCategory struct {
    ID           int              `json:"id"`
    Slug         string           `json:"slug"`
    Title        string           `json:"title"`
    Description  string           `json:"description"`
    CoverImage   string           `json:"cover_image"`
    DisplayOrder int              `json:"display_order"`
    Images       []GalleryImage   `json:"images,omitempty"`
    CreatedAt    time.Time        `json:"created_at"`
    UpdatedAt    time.Time        `json:"updated_at"`
}

// GalleryImage represents an image in a gallery
type GalleryImage struct {
    ID           int       `json:"id"`
    CategoryID   int       `json:"category_id"`
    Src          string    `json:"src"`
    Alt          string    `json:"alt"`
    AspectRatio  string    `json:"aspect_ratio"`
    DisplayOrder int       `json:"display_order"`
    CreatedAt    time.Time `json:"created_at"`
}
```

### 8.2 Repository Pattern (internal/repository/)

```go
// backend/internal/repository/contact_repo.go
package repository

import (
    "database/sql"

    "github.com/yourusername/portfolio-backend/internal/models"
)

// ContactRepository handles database operations for contact messages
type ContactRepository struct {
    db *sql.DB
}

// NewContactRepository creates a new repository
func NewContactRepository(db *sql.DB) *ContactRepository {
    return &ContactRepository{db: db}
}

// Create inserts a new contact message
func (r *ContactRepository) Create(msg *models.ContactRequest) (*models.ContactMessage, error) {
    query := `
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, subject, message, is_read, created_at
    `

    var created models.ContactMessage
    err := r.db.QueryRow(query, msg.Name, msg.Email, msg.Subject, msg.Message).Scan(
        &created.ID,
        &created.Name,
        &created.Email,
        &created.Subject,
        &created.Message,
        &created.IsRead,
        &created.CreatedAt,
    )

    if err != nil {
        return nil, err
    }

    return &created, nil
}

// GetAll retrieves all contact messages
func (r *ContactRepository) GetAll() ([]models.ContactMessage, error) {
    query := `
        SELECT id, name, email, subject, message, is_read, created_at
        FROM contact_messages
        ORDER BY created_at DESC
    `

    rows, err := r.db.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var messages []models.ContactMessage
    for rows.Next() {
        var msg models.ContactMessage
        if err := rows.Scan(
            &msg.ID,
            &msg.Name,
            &msg.Email,
            &msg.Subject,
            &msg.Message,
            &msg.IsRead,
            &msg.CreatedAt,
        ); err != nil {
            return nil, err
        }
        messages = append(messages, msg)
    }

    return messages, nil
}

// MarkAsRead marks a message as read
func (r *ContactRepository) MarkAsRead(id int) error {
    query := `UPDATE contact_messages SET is_read = TRUE WHERE id = $1`
    _, err := r.db.Exec(query, id)
    return err
}

// Delete removes a message
func (r *ContactRepository) Delete(id int) error {
    query := `DELETE FROM contact_messages WHERE id = $1`
    _, err := r.db.Exec(query, id)
    return err
}
```

### 8.3 Handlers (internal/handlers/)

```go
// backend/internal/handlers/contact.go
package handlers

import (
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"

    "github.com/yourusername/portfolio-backend/internal/models"
    "github.com/yourusername/portfolio-backend/internal/repository"
    "github.com/yourusername/portfolio-backend/internal/services"
    "github.com/yourusername/portfolio-backend/pkg/response"
)

// ContactHandler handles contact form requests
type ContactHandler struct {
    repo     *repository.ContactRepository
    email    *services.EmailService
    validate *validator.Validate
}

// NewContactHandler creates a new handler
func NewContactHandler(repo *repository.ContactRepository, email *services.EmailService) *ContactHandler {
    return &ContactHandler{
        repo:     repo,
        email:    email,
        validate: validator.New(),
    }
}

// Submit handles POST /api/contact
func (h *ContactHandler) Submit(c *gin.Context) {
    var req models.ContactRequest

    // Parse JSON body
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "Invalid request body")
        return
    }

    // Validate input
    if err := h.validate.Struct(req); err != nil {
        response.ValidationError(c, err)
        return
    }

    // Save to database
    msg, err := h.repo.Create(&req)
    if err != nil {
        log.Printf("Failed to save contact message: %v", err)
        response.Error(c, http.StatusInternalServerError, "Failed to submit message")
        return
    }

    // Send email notification (async)
    go func() {
        if err := h.email.SendContactNotification(msg); err != nil {
            log.Printf("Failed to send email notification: %v", err)
        }
    }()

    response.Success(c, http.StatusCreated, "Message sent successfully", msg)
}

// GetAll handles GET /api/admin/contacts (protected)
func (h *ContactHandler) GetAll(c *gin.Context) {
    messages, err := h.repo.GetAll()
    if err != nil {
        log.Printf("Failed to fetch contact messages: %v", err)
        response.Error(c, http.StatusInternalServerError, "Failed to fetch messages")
        return
    }

    response.Success(c, http.StatusOK, "Messages retrieved", messages)
}

// MarkAsRead handles PATCH /api/admin/contacts/:id/read
func (h *ContactHandler) MarkAsRead(c *gin.Context) {
    id := c.Param("id")
    
    // Convert string to int would be here
    // For brevity, assuming middleware handles validation

    if err := h.repo.MarkAsRead(1); err != nil { // Use parsed id
        response.Error(c, http.StatusInternalServerError, "Failed to update message")
        return
    }

    response.Success(c, http.StatusOK, "Message marked as read", nil)
}
```

### 8.4 Standard Response Helper (pkg/response/response.go)

```go
// backend/pkg/response/response.go
package response

import (
    "github.com/gin-gonic/gin"
    "github.com/go-playground/validator/v10"
)

// APIResponse is the standard response format
type APIResponse struct {
    Success bool        `json:"success"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Errors  interface{} `json:"errors,omitempty"`
}

// Success sends a successful response
func Success(c *gin.Context, status int, message string, data interface{}) {
    c.JSON(status, APIResponse{
        Success: true,
        Message: message,
        Data:    data,
    })
}

// Error sends an error response
func Error(c *gin.Context, status int, message string) {
    c.JSON(status, APIResponse{
        Success: false,
        Message: message,
    })
}

// ValidationError formats validation errors
func ValidationError(c *gin.Context, err error) {
    var errors []map[string]string

    for _, err := range err.(validator.ValidationErrors) {
        errors = append(errors, map[string]string{
            "field":   err.Field(),
            "message": getValidationMessage(err),
        })
    }

    c.JSON(400, APIResponse{
        Success: false,
        Message: "Validation failed",
        Errors:  errors,
    })
}

func getValidationMessage(err validator.FieldError) string {
    switch err.Tag() {
    case "required":
        return "This field is required"
    case "email":
        return "Invalid email format"
    case "min":
        return "Value is too short"
    case "max":
        return "Value is too long"
    default:
        return "Invalid value"
    }
}
```

### 8.5 Router Setup (internal/router/router.go)

```go
// backend/internal/router/router.go
package router

import (
    "database/sql"

    "github.com/gin-gonic/gin"

    "github.com/yourusername/portfolio-backend/internal/config"
    "github.com/yourusername/portfolio-backend/internal/handlers"
    "github.com/yourusername/portfolio-backend/internal/middleware"
    "github.com/yourusername/portfolio-backend/internal/repository"
    "github.com/yourusername/portfolio-backend/internal/services"
)

// New creates and configures the router
func New(db *sql.DB, cfg *config.Config) *gin.Engine {
    // Set Gin mode
    if cfg.Environment == "production" {
        gin.SetMode(gin.ReleaseMode)
    }

    r := gin.Default()

    // Global middleware
    r.Use(middleware.CORS(cfg.FrontendURL))
    r.Use(middleware.RequestLogger())

    // Initialize services
    emailService := services.NewEmailService(cfg)

    // Initialize repositories
    contactRepo := repository.NewContactRepository(db)
    // galleryRepo := repository.NewGalleryRepository(db)

    // Initialize handlers
    contactHandler := handlers.NewContactHandler(contactRepo, emailService)
    // galleryHandler := handlers.NewGalleryHandler(galleryRepo)
    // authHandler := handlers.NewAuthHandler(cfg)

    // Health check
    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    // API routes
    api := r.Group("/api")
    {
        // Public routes
        api.POST("/contact", contactHandler.Submit)
        
        // Gallery routes (public read)
        // api.GET("/galleries", galleryHandler.GetAll)
        // api.GET("/galleries/:slug", galleryHandler.GetBySlug)

        // Authentication
        // api.POST("/auth/login", authHandler.Login)

        // Protected routes (admin only)
        admin := api.Group("/admin")
        admin.Use(middleware.AuthRequired(cfg.JWTSecret))
        {
            admin.GET("/contacts", contactHandler.GetAll)
            admin.PATCH("/contacts/:id/read", contactHandler.MarkAsRead)
            
            // Gallery management
            // admin.POST("/galleries", galleryHandler.Create)
            // admin.PUT("/galleries/:id", galleryHandler.Update)
            // admin.DELETE("/galleries/:id", galleryHandler.Delete)
            
            // Image upload
            // admin.POST("/upload", uploadHandler.Upload)
        }
    }

    // Serve uploaded files
    r.Static("/uploads", cfg.UploadDir)

    return r
}
```

---

## 9. Authentication & Security

### 9.1 Middleware (internal/middleware/)

```go
// backend/internal/middleware/cors.go
package middleware

import (
    "github.com/gin-gonic/gin"
)

// CORS returns a middleware that handles Cross-Origin Resource Sharing
func CORS(allowedOrigin string) gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}
```

```go
// backend/internal/middleware/auth.go
package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"

    "github.com/yourusername/portfolio-backend/pkg/response"
)

// Claims represents JWT claims
type Claims struct {
    UserID int    `json:"user_id"`
    Email  string `json:"email"`
    jwt.RegisteredClaims
}

// AuthRequired middleware validates JWT tokens
func AuthRequired(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Get Authorization header
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            response.Error(c, http.StatusUnauthorized, "Authorization header required")
            c.Abort()
            return
        }

        // Extract token
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        if tokenString == authHeader {
            response.Error(c, http.StatusUnauthorized, "Invalid authorization format")
            c.Abort()
            return
        }

        // Parse and validate token
        token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
            return []byte(jwtSecret), nil
        })

        if err != nil || !token.Valid {
            response.Error(c, http.StatusUnauthorized, "Invalid or expired token")
            c.Abort()
            return
        }

        // Extract claims and set in context
        if claims, ok := token.Claims.(*Claims); ok {
            c.Set("user_id", claims.UserID)
            c.Set("email", claims.Email)
        }

        c.Next()
    }
}
```

```go
// backend/internal/middleware/logging.go
package middleware

import (
    "log"
    "time"

    "github.com/gin-gonic/gin"
)

// RequestLogger logs incoming requests
func RequestLogger() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        path := c.Request.URL.Path

        c.Next()

        duration := time.Since(start)
        status := c.Writer.Status()

        log.Printf("[%s] %s %s %d %v",
            c.Request.Method,
            path,
            c.ClientIP(),
            status,
            duration,
        )
    }
}
```

### 9.2 Authentication Handler

```go
// backend/internal/handlers/auth.go
package handlers

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"

    "github.com/yourusername/portfolio-backend/internal/config"
    "github.com/yourusername/portfolio-backend/internal/middleware"
    "github.com/yourusername/portfolio-backend/internal/repository"
    "github.com/yourusername/portfolio-backend/pkg/response"
)

type AuthHandler struct {
    repo   *repository.UserRepository
    config *config.Config
}

type LoginRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=8"`
}

func NewAuthHandler(repo *repository.UserRepository, cfg *config.Config) *AuthHandler {
    return &AuthHandler{repo: repo, config: cfg}
}

func (h *AuthHandler) Login(c *gin.Context) {
    var req LoginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        response.Error(c, http.StatusBadRequest, "Invalid request")
        return
    }

    // Find user
    user, err := h.repo.GetByEmail(req.Email)
    if err != nil {
        response.Error(c, http.StatusUnauthorized, "Invalid credentials")
        return
    }

    // Verify password
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
        response.Error(c, http.StatusUnauthorized, "Invalid credentials")
        return
    }

    // Generate JWT
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &middleware.Claims{
        UserID: user.ID,
        Email:  user.Email,
        RegisteredClaims: jwt.RegisteredClaims{
            ExpiresAt: jwt.NewNumericDate(expirationTime),
            IssuedAt:  jwt.NewNumericDate(time.Now()),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString([]byte(h.config.JWTSecret))
    if err != nil {
        response.Error(c, http.StatusInternalServerError, "Failed to generate token")
        return
    }

    // Update last login
    h.repo.UpdateLastLogin(user.ID)

    response.Success(c, http.StatusOK, "Login successful", gin.H{
        "token": tokenString,
        "user": gin.H{
            "id":    user.ID,
            "email": user.Email,
            "name":  user.Name,
        },
    })
}
```

---

## 10. File Upload Handling

### 10.1 Storage Service (internal/services/storage.go)

```go
// backend/internal/services/storage.go
package services

import (
    "fmt"
    "io"
    "mime/multipart"
    "os"
    "path/filepath"
    "strings"

    "github.com/google/uuid"
)

type StorageService struct {
    uploadDir   string
    maxFileSize int64
    allowedTypes map[string]bool
}

func NewStorageService(uploadDir string, maxFileSize int64) *StorageService {
    // Create upload directory if not exists
    os.MkdirAll(uploadDir, 0755)

    return &StorageService{
        uploadDir:   uploadDir,
        maxFileSize: maxFileSize,
        allowedTypes: map[string]bool{
            "image/jpeg": true,
            "image/png":  true,
            "image/webp": true,
            "image/gif":  true,
        },
    }
}

// SaveFile saves an uploaded file and returns the URL
func (s *StorageService) SaveFile(file *multipart.FileHeader) (string, error) {
    // Validate file size
    if file.Size > s.maxFileSize {
        return "", fmt.Errorf("file too large (max %d MB)", s.maxFileSize/1024/1024)
    }

    // Validate file type
    contentType := file.Header.Get("Content-Type")
    if !s.allowedTypes[contentType] {
        return "", fmt.Errorf("file type not allowed: %s", contentType)
    }

    // Open uploaded file
    src, err := file.Open()
    if err != nil {
        return "", err
    }
    defer src.Close()

    // Generate unique filename
    ext := filepath.Ext(file.Filename)
    filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
    filepath := filepath.Join(s.uploadDir, filename)

    // Create destination file
    dst, err := os.Create(filepath)
    if err != nil {
        return "", err
    }
    defer dst.Close()

    // Copy content
    if _, err := io.Copy(dst, src); err != nil {
        return "", err
    }

    // Return public URL
    return "/uploads/" + filename, nil
}

// DeleteFile removes a file from storage
func (s *StorageService) DeleteFile(url string) error {
    // Extract filename from URL
    filename := strings.TrimPrefix(url, "/uploads/")
    filepath := filepath.Join(s.uploadDir, filename)

    return os.Remove(filepath)
}
```

### 10.2 Upload Handler

```go
// backend/internal/handlers/upload.go
package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"

    "github.com/yourusername/portfolio-backend/internal/services"
    "github.com/yourusername/portfolio-backend/pkg/response"
)

type UploadHandler struct {
    storage *services.StorageService
}

func NewUploadHandler(storage *services.StorageService) *UploadHandler {
    return &UploadHandler{storage: storage}
}

// Upload handles POST /api/admin/upload
func (h *UploadHandler) Upload(c *gin.Context) {
    // Get file from form
    file, err := c.FormFile("file")
    if err != nil {
        response.Error(c, http.StatusBadRequest, "No file uploaded")
        return
    }

    // Save file
    url, err := h.storage.SaveFile(file)
    if err != nil {
        response.Error(c, http.StatusBadRequest, err.Error())
        return
    }

    response.Success(c, http.StatusOK, "File uploaded successfully", gin.H{
        "url": url,
    })
}

// UploadMultiple handles multiple file uploads
func (h *UploadHandler) UploadMultiple(c *gin.Context) {
    form, err := c.MultipartForm()
    if err != nil {
        response.Error(c, http.StatusBadRequest, "Invalid form data")
        return
    }

    files := form.File["files"]
    var urls []string

    for _, file := range files {
        url, err := h.storage.SaveFile(file)
        if err != nil {
            response.Error(c, http.StatusBadRequest, err.Error())
            return
        }
        urls = append(urls, url)
    }

    response.Success(c, http.StatusOK, "Files uploaded successfully", gin.H{
        "urls": urls,
    })
}
```

---

## 11. Email Service Integration

### 11.1 Email Service (internal/services/email.go)

```go
// backend/internal/services/email.go
package services

import (
    "bytes"
    "fmt"
    "html/template"
    "net/smtp"

    "github.com/yourusername/portfolio-backend/internal/config"
    "github.com/yourusername/portfolio-backend/internal/models"
)

type EmailService struct {
    host     string
    port     string
    user     string
    password string
    from     string
    to       string
}

func NewEmailService(cfg *config.Config) *EmailService {
    return &EmailService{
        host:     cfg.SMTPHost,
        port:     cfg.SMTPPort,
        user:     cfg.SMTPUser,
        password: cfg.SMTPPassword,
        from:     cfg.EmailFrom,
        to:       cfg.EmailTo,
    }
}

// SendContactNotification sends an email when a contact form is submitted
func (s *EmailService) SendContactNotification(msg *models.ContactMessage) error {
    if s.user == "" || s.password == "" {
        // Email not configured, skip silently
        return nil
    }

    subject := fmt.Sprintf("New Contact Form Submission: %s", msg.Subject)
    
    // Email template
    tmpl := `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0a0a0a; color: #fff; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #666; }
        .value { margin-top: 5px; }
        .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Message</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From:</div>
                <div class="value">{{.Name}} ({{.Email}})</div>
            </div>
            <div class="field">
                <div class="label">Subject:</div>
                <div class="value">{{.Subject}}</div>
            </div>
            <div class="field">
                <div class="label">Message:</div>
                <div class="value">{{.Message}}</div>
            </div>
            <div class="field">
                <div class="label">Received:</div>
                <div class="value">{{.CreatedAt.Format "Jan 02, 2006 at 3:04 PM"}}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from your portfolio website contact form.</p>
        </div>
    </div>
</body>
</html>
`

    t, err := template.New("email").Parse(tmpl)
    if err != nil {
        return err
    }

    var body bytes.Buffer
    if err := t.Execute(&body, msg); err != nil {
        return err
    }

    // Build email
    mime := "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
    emailBody := fmt.Sprintf("To: %s\r\nFrom: %s\r\nSubject: %s\r\n%s\r\n%s",
        s.to, s.from, subject, mime, body.String())

    // Send via SMTP
    auth := smtp.PlainAuth("", s.user, s.password, s.host)
    addr := fmt.Sprintf("%s:%s", s.host, s.port)

    return smtp.SendMail(addr, auth, s.from, []string{s.to}, []byte(emailBody))
}
```

---

## 12. Frontend-Backend Integration

### 12.1 Update Frontend API Calls

Create an API service in your React frontend:

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  return response.json();
}

// Contact form submission
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Get galleries (if using database)
export async function getGalleries() {
  return fetchApi('/galleries');
}

// Get single gallery
export async function getGallery(slug: string) {
  return fetchApi(`/galleries/${slug}`);
}

// Admin: Login
export async function login(email: string, password: string) {
  const response = await fetchApi<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data?.token) {
    localStorage.setItem('auth_token', response.data.token);
  }

  return response;
}

// Admin: Upload image
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  return response.json();
}
```

### 12.2 Update Contact Page

```tsx
// src/pages/Contact.tsx - Updated submit handler
import { submitContactForm } from '@/services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await submitContactForm(formData);

    if (response.success) {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      // Handle validation errors
      if (response.errors) {
        response.errors.forEach(error => {
          toast({
            title: "Validation Error",
            description: `${error.field}: ${error.message}`,
            variant: "destructive",
          });
        });
      } else {
        throw new Error(response.message);
      }
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to send message. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

### 12.3 Environment Variables

Add to your frontend:

```bash
# .env.local (create this file in frontend root)
VITE_API_URL=http://localhost:8080/api
```

```bash
# .env.production
VITE_API_URL=https://api.anushreesingh.com/api
```

---

## 13. Testing Your Backend

### 13.1 Create Test Files

```go
// backend/internal/handlers/contact_test.go
package handlers_test

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

func TestContactSubmit(t *testing.T) {
    gin.SetMode(gin.TestMode)

    tests := []struct {
        name       string
        body       map[string]string
        wantStatus int
    }{
        {
            name: "valid submission",
            body: map[string]string{
                "name":    "Test User",
                "email":   "test@example.com",
                "subject": "Test Subject",
                "message": "This is a test message that is long enough.",
            },
            wantStatus: http.StatusCreated,
        },
        {
            name: "missing email",
            body: map[string]string{
                "name":    "Test User",
                "message": "This is a test message.",
            },
            wantStatus: http.StatusBadRequest,
        },
        {
            name: "invalid email",
            body: map[string]string{
                "name":    "Test User",
                "email":   "not-an-email",
                "message": "This is a test message that is long enough.",
            },
            wantStatus: http.StatusBadRequest,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Setup router with handler
            // ... (setup code here)

            body, _ := json.Marshal(tt.body)
            req := httptest.NewRequest("POST", "/api/contact", bytes.NewBuffer(body))
            req.Header.Set("Content-Type", "application/json")
            
            w := httptest.NewRecorder()
            // router.ServeHTTP(w, req)

            assert.Equal(t, tt.wantStatus, w.Code)
        })
    }
}
```

### 13.2 Run Tests

```bash
# Run all tests
go test ./...

# Run with verbose output
go test -v ./...

# Run with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### 13.3 Manual API Testing

Use curl or a REST client:

```bash
# Health check
curl http://localhost:8080/health

# Submit contact form
curl -X POST http://localhost:8080/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Hello",
    "message": "This is a test message from the API."
  }'

# Login (admin)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'

# Get contacts (with auth token)
curl http://localhost:8080/api/admin/contacts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 14. Deployment Guide

### 14.1 Build for Production

```bash
# Build binary
cd backend
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/server cmd/server/main.go

# The binary is now in backend/bin/server
```

### 14.2 Dockerfile

```dockerfile
# backend/Dockerfile
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /server cmd/server/main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy binary
COPY --from=builder /server .

# Create uploads directory
RUN mkdir -p /root/uploads

EXPOSE 8080

CMD ["./server"]
```

### 14.3 Docker Compose (Full Stack)

```yaml
# docker-compose.yml (in project root)
version: '3.8'

services:
  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: portfolio_db
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Go Backend
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - ENVIRONMENT=production
      - DATABASE_URL=postgres://portfolio_user:${DB_PASSWORD}@db:5432/portfolio_db?sslmode=disable
      - JWT_SECRET=${JWT_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASSWORD=${SMTP_PASSWORD}
      - EMAIL_FROM=${EMAIL_FROM}
      - EMAIL_TO=${EMAIL_TO}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - db
    volumes:
      - uploads:/root/uploads

  # React Frontend (for production)
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  uploads:
```

### 14.4 Deployment Options

#### Option A: Railway / Render / Fly.io

```bash
# Example: Deploy to Fly.io
fly launch
fly secrets set DATABASE_URL="..."
fly secrets set JWT_SECRET="..."
fly deploy
```

#### Option B: DigitalOcean / AWS / GCP

1. Set up a VM with Docker
2. Clone your repository
3. Create `.env` file with production values
4. Run `docker-compose up -d`

#### Option C: Serverless (AWS Lambda)

Requires additional configuration with AWS SAM or Serverless Framework.

---

## 15. Troubleshooting

### Common Errors and Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `connection refused` | Database not running | Start PostgreSQL service |
| `pq: password authentication failed` | Wrong DB credentials | Check `.env` DATABASE_URL |
| `undefined: gin.Context` | Missing import | Run `go mod tidy` |
| `CORS error` in browser | Frontend URL mismatch | Update FRONTEND_URL in config |
| `token is expired` | JWT expired | Login again to get new token |
| `no such file or directory` | Upload dir missing | Create `uploads/` folder |

### Debug Mode

```go
// Add to main.go for debugging
import "runtime/debug"

func main() {
    // Print build info
    if info, ok := debug.ReadBuildInfo(); ok {
        fmt.Printf("Go version: %s\n", info.GoVersion)
        fmt.Printf("Dependencies: %d\n", len(info.Deps))
    }
    
    // ... rest of main
}
```

### Logging Best Practices

```go
// Use structured logging
import "log/slog"

func main() {
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
    slog.SetDefault(logger)

    slog.Info("Server starting", "port", cfg.Port)
    slog.Error("Database connection failed", "error", err)
}
```

---

## 16. Quick Reference Cheatsheet

### Essential Commands

```bash
# Development
go run cmd/server/main.go          # Run server
air                                 # Run with hot reload
go mod tidy                        # Clean dependencies

# Building
go build -o bin/server cmd/server/main.go

# Testing
go test ./...                      # Run all tests
go test -v ./internal/handlers/    # Test specific package

# Database
psql -U portfolio_user -d portfolio_db    # Connect to DB

# Docker
docker-compose up -d               # Start all services
docker-compose logs -f backend     # View backend logs
docker-compose down                # Stop all services
```

### API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/contact` | No | Submit contact form |
| GET | `/api/galleries` | No | List all galleries |
| GET | `/api/galleries/:slug` | No | Get single gallery |
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/admin/contacts` | Yes | List all messages |
| PATCH | `/api/admin/contacts/:id/read` | Yes | Mark as read |
| POST | `/api/admin/upload` | Yes | Upload image |
| POST | `/api/admin/galleries` | Yes | Create gallery |
| PUT | `/api/admin/galleries/:id` | Yes | Update gallery |
| DELETE | `/api/admin/galleries/:id` | Yes | Delete gallery |

### Project File Dependencies

```
cmd/server/main.go
    └── internal/config
    └── internal/database
    └── internal/router
            └── internal/handlers
            │       └── internal/models
            │       └── internal/repository
            │       └── internal/services
            │       └── pkg/response
            └── internal/middleware
```

---

## Next Steps

1. **Copy this guide** to your project as `BACKEND_DEVELOPMENT_GOLANG.md`
2. **Set up Go environment** following Section 3
3. **Create the backend folder structure** from Section 5
4. **Implement files one by one** starting with config and database
5. **Test with curl** before connecting to frontend
6. **Deploy** using Docker Compose

---

> **Need Help?**
> - Go Documentation: https://go.dev/doc/
> - Gin Framework: https://gin-gonic.com/docs/
> - PostgreSQL: https://www.postgresql.org/docs/

---

*This guide was created for the Anushree Singh Portfolio project. Last updated: January 2026*
