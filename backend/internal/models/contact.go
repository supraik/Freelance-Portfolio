// backend/internal/models/contact.go
package models

import "time"

// ContactRequest represents a contact form submission
type ContactRequest struct {
	Name    string `json:"name" validate:"required,min=2,max=100"`
	Email   string `json:"email" validate:"required,email"`
	Phone   string `json:"phone" validate:"omitempty,min=10,max=15"`
	Subject string `json:"subject" validate:"required,min=5,max=200"`
	Message string `json:"message" validate:"required,min=10,max=1000"`
}

// ContactMessage represents a stored contact message
type ContactMessage struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Email     string    `json:"email" db:"email"`
	Phone     string    `json:"phone" db:"phone"`
	Subject   string    `json:"subject" db:"subject"`
	Message   string    `json:"message" db:"message"`
	Status    string    `json:"status" db:"status"` // pending, read, archived
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
