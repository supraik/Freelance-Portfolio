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