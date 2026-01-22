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

	// Cloudinary
	CloudinaryCloudName string
	CloudinaryAPIKey    string
	CloudinaryAPISecret string
	CloudinaryFolder    string

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

		// Cloudinary
		CloudinaryCloudName: getEnv("CLOUDINARY_CLOUD_NAME", ""),
		CloudinaryAPIKey:    getEnv("CLOUDINARY_API_KEY", ""),
		CloudinaryAPISecret: getEnv("CLOUDINARY_API_SECRET", ""),
		CloudinaryFolder:    getEnv("CLOUDINARY_FOLDER", "portfolio"),

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
