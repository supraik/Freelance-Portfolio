// backend/internal/repository/contact_repo.go
package repository

import (
	"database/sql"
	"time"

	"github.com/supraik/Freelance-Portfolio/internal/models"
)

// ContactRepository handles contact message data operations
type ContactRepository struct {
	db *sql.DB
}

// NewContactRepository creates a new contact repository
func NewContactRepository(db *sql.DB) *ContactRepository {
	return &ContactRepository{db: db}
}

// Create saves a new contact message
func (r *ContactRepository) Create(req *models.ContactRequest) (*models.ContactMessage, error) {
	msg := &models.ContactMessage{
		Name:      req.Name,
		Email:     req.Email,
		Phone:     req.Phone,
		Subject:   req.Subject,
		Message:   req.Message,
		Status:    "pending",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `
		INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`

	err := r.db.QueryRow(
		query,
		msg.Name,
		msg.Email,
		msg.Phone,
		msg.Subject,
		msg.Message,
		msg.Status,
		msg.CreatedAt,
		msg.UpdatedAt,
	).Scan(&msg.ID)

	if err != nil {
		return nil, err
	}

	return msg, nil
}

// GetAll retrieves all contact messages
func (r *ContactRepository) GetAll() ([]models.ContactMessage, error) {
	query := `
		SELECT id, name, email, phone, subject, message, status, created_at, updated_at
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
		err := rows.Scan(
			&msg.ID,
			&msg.Name,
			&msg.Email,
			&msg.Phone,
			&msg.Subject,
			&msg.Message,
			&msg.Status,
			&msg.CreatedAt,
			&msg.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	return messages, nil
}

// GetByID retrieves a contact message by ID
func (r *ContactRepository) GetByID(id int) (*models.ContactMessage, error) {
	query := `
		SELECT id, name, email, phone, subject, message, status, created_at, updated_at
		FROM contact_messages
		WHERE id = $1
	`

	var msg models.ContactMessage
	err := r.db.QueryRow(query, id).Scan(
		&msg.ID,
		&msg.Name,
		&msg.Email,
		&msg.Phone,
		&msg.Subject,
		&msg.Message,
		&msg.Status,
		&msg.CreatedAt,
		&msg.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &msg, nil
}

// UpdateStatus updates the status of a contact message
func (r *ContactRepository) UpdateStatus(id int, status string) error {
	query := `
		UPDATE contact_messages
		SET status = $1, updated_at = $2
		WHERE id = $3
	`

	_, err := r.db.Exec(query, status, time.Now(), id)
	return err
}

// MarkAsRead marks a contact message as read
func (r *ContactRepository) MarkAsRead(id int) error {
	return r.UpdateStatus(id, "read")
}

// Delete removes a contact message
func (r *ContactRepository) Delete(id int) error {
	query := `DELETE FROM contact_messages WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
