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

	validationErrors, ok := err.(validator.ValidationErrors)
	if !ok {
		// If it's not a validation error, send generic error
		Error(c, 400, "Validation failed")
		return
	}

	for _, err := range validationErrors {
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

// getValidationMessage returns a user-friendly validation error message
func getValidationMessage(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email format"
	case "min":
		return "Value is too short (minimum " + err.Param() + " characters)"
	case "max":
		return "Value is too long (maximum " + err.Param() + " characters)"
	case "url":
		return "Invalid URL format"
	case "slug":
		return "Invalid slug format (use lowercase letters, numbers, and hyphens)"
	default:
		return "Invalid value"
	}
}

// Paginated sends a paginated response
func Paginated(c *gin.Context, status int, message string, data interface{}, page, pageSize, total int) {
	c.JSON(status, gin.H{
		"success": true,
		"message": message,
		"data":    data,
		"pagination": gin.H{
			"page":      page,
			"page_size": pageSize,
			"total":     total,
			"pages":     (total + pageSize - 1) / pageSize,
		},
	})
}
