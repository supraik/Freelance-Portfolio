// backend/internal/repository/user_repo.go
package repository

import (
	"database/sql"
	"time"

	"github.com/supraik/Freelance-Portfolio/internal/models"
)

// UserRepository handles database operations for users
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository creates a new repository
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// GetByEmail retrieves a user by email
func (r *UserRepository) GetByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, last_login
		FROM admin_users
		WHERE email = $1
	`

	var user models.User
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.CreatedAt,
		&user.LastLogin,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// GetByID retrieves a user by ID
func (r *UserRepository) GetByID(id int) (*models.User, error) {
	query := `
		SELECT id, email, password_hash, name, created_at, last_login
		FROM admin_users
		WHERE id = $1
	`

	var user models.User
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.Name,
		&user.CreatedAt,
		&user.LastLogin,
	)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// Create creates a new admin user
func (r *UserRepository) Create(user *models.User) error {
	query := `
		INSERT INTO admin_users (email, password_hash, name)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`

	return r.db.QueryRow(query, user.Email, user.PasswordHash, user.Name).Scan(
		&user.ID,
		&user.CreatedAt,
	)
}

// UpdateLastLogin updates the last login timestamp
func (r *UserRepository) UpdateLastLogin(id int) error {
	query := `
		UPDATE admin_users
		SET last_login = $1
		WHERE id = $2
	`

	now := time.Now()
	_, err := r.db.Exec(query, now, id)
	return err
}

// EmailExists checks if an email already exists
func (r *UserRepository) EmailExists(email string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM admin_users WHERE email = $1)`

	var exists bool
	err := r.db.QueryRow(query, email).Scan(&exists)
	return exists, err
}
