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
		// Contact messages table
		`CREATE TABLE IF NOT EXISTS contact_messages (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			email VARCHAR(255) NOT NULL,
			subject VARCHAR(255),
			message TEXT NOT NULL,
			is_read BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Gallery categories table
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

		// Gallery images table
		`CREATE TABLE IF NOT EXISTS gallery_images (
			id SERIAL PRIMARY KEY,
			category_id INT REFERENCES gallery_categories(id) ON DELETE CASCADE,
			src VARCHAR(500) NOT NULL,
			alt VARCHAR(255),
			aspect_ratio VARCHAR(20) DEFAULT 'portrait',
			display_order INT DEFAULT 0,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Admin users table
		`CREATE TABLE IF NOT EXISTS admin_users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			last_login TIMESTAMP
		)`,

		// Page analytics table (optional)
		`CREATE TABLE IF NOT EXISTS page_analytics (
			id SERIAL PRIMARY KEY,
			page_path VARCHAR(255) NOT NULL,
			visitor_id VARCHAR(100),
			user_agent TEXT,
			referrer VARCHAR(500),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`,

		// Create indexes for better performance
		`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC)`,
		`CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read)`,
		`CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category_id)`,
		`CREATE INDEX IF NOT EXISTS idx_gallery_categories_slug ON gallery_categories(slug)`,
		`CREATE INDEX IF NOT EXISTS idx_page_analytics_path ON page_analytics(page_path)`,
		`CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at DESC)`,
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

// SeedAdminUser creates a default admin user if none exists
// Call this only once during initial setup
func SeedAdminUser(db *sql.DB, email, passwordHash, name string) error {
	query := `
		INSERT INTO admin_users (email, password_hash, name)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO NOTHING
		RETURNING id
	`

	var id int
	err := db.QueryRow(query, email, passwordHash, name).Scan(&id)
	if err == sql.ErrNoRows {
		log.Printf("Admin user %s already exists, skipping", email)
		return nil
	}
	if err != nil {
		return fmt.Errorf("failed to seed admin user: %w", err)
	}

	log.Printf("✅ Admin user created with ID: %d", id)
	return nil
}
