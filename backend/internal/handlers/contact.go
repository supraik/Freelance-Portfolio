// backend/internal/handlers/contact.go
package handlers

import (
	"log"
	"net/http"
	"strconv"

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

	// Send emails (async) - both acknowledgment to client and notification to model
	go func() {
		// Send acknowledgment email to the client
		if err := h.email.SendAcknowledgmentEmail(msg); err != nil {
			log.Printf("Failed to send acknowledgment email to client: %v", err)
		}

		// Send notification email to the model (portfolio owner)
		if err := h.email.SendContactNotification(msg); err != nil {
			log.Printf("Failed to send notification email to portfolio owner: %v", err)
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
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid contact ID")
		return
	}

	if err := h.repo.MarkAsRead(id); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to update message")
		return
	}

	response.Success(c, http.StatusOK, "Message marked as read", nil)
}

// Delete handles DELETE /api/admin/contacts/:id (optional)
func (h *ContactHandler) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid contact ID")
		return
	}

	if err := h.repo.Delete(id); err != nil {
		log.Printf("Failed to delete contact message: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to delete message")
		return
	}

	response.Success(c, http.StatusOK, "Message deleted successfully", nil)
}
