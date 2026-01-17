// backend/scripts/create_admin.go
// Run this script to create the first admin user
// Usage: go run scripts/create_admin.go

package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"syscall"

	"golang.org/x/crypto/bcrypt"
	"golang.org/x/term"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// Load .env file
	godotenv.Load()

	// Get database URL from environment
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL not set in environment")
	}

	// Connect to database
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	fmt.Println("📝 Create Admin User")
	fmt.Println("-------------------")

	// Get user input
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Email: ")
	email, _ := reader.ReadString('\n')
	email = strings.TrimSpace(email)

	fmt.Print("Name: ")
	name, _ := reader.ReadString('\n')
	name = strings.TrimSpace(name)

	fmt.Print("Password: ")
	passwordBytes, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		log.Fatalf("Failed to read password: %v", err)
	}
	password := string(passwordBytes)
	fmt.Println() // New line after password

	// Validate input
	if email == "" || name == "" || password == "" {
		log.Fatal("All fields are required")
	}

	if len(password) < 8 {
		log.Fatal("Password must be at least 8 characters")
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	// Insert user
	query := `
		INSERT INTO admin_users (email, password_hash, name)
		VALUES ($1, $2, $3)
		RETURNING id
	`

	var userID int
	err = db.QueryRow(query, email, string(hashedPassword), name).Scan(&userID)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key") {
			log.Fatalf("User with email %s already exists", email)
		}
		log.Fatalf("Failed to create user: %v", err)
	}

	fmt.Printf("\n✅ Admin user created successfully!\n")
	fmt.Printf("   ID: %d\n", userID)
	fmt.Printf("   Email: %s\n", email)
	fmt.Printf("   Name: %s\n", name)
	fmt.Println("\nYou can now login with these credentials.")
}
