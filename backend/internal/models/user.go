// backend/internal/models/user.go
package models

import "time"

// User represents an admin user
type User struct {
	ID           int        `json:"id"`
	Email        string     `json:"email" validate:"required,email"`
	PasswordHash string     `json:"-"` // Never send in JSON
	Name         string     `json:"name"`
	CreatedAt    time.Time  `json:"created_at"`
	LastLogin    *time.Time `json:"last_login,omitempty"`
}

// LoginRequest is the request body for login
type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

// LoginResponse is the response after successful login
type LoginResponse struct {
	Token string   `json:"token"`
	User  UserInfo `json:"user"`
}

// UserInfo is public user information
type UserInfo struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
	Name  string `json:"name"`
}
