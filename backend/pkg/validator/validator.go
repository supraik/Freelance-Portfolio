// backend/pkg/validator/validator.go
package validator

import (
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
)

var (
	// EmailRegex is a basic email validation regex
	EmailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

	// SlugRegex validates URL-friendly slugs
	SlugRegex = regexp.MustCompile(`^[a-z0-9]+(?:-[a-z0-9]+)*$`)
)

// New creates a new validator instance with custom validation rules
func New() *validator.Validate {
	v := validator.New()

	// Register custom validations
	v.RegisterValidation("slug", validateSlug)

	return v
}

// validateSlug validates that a string is a valid URL slug
func validateSlug(fl validator.FieldLevel) bool {
	slug := fl.Field().String()
	return SlugRegex.MatchString(slug)
}

// IsValidEmail checks if an email is valid
func IsValidEmail(email string) bool {
	return EmailRegex.MatchString(email)
}

// IsValidSlug checks if a slug is valid
func IsValidSlug(slug string) bool {
	return SlugRegex.MatchString(slug)
}

// SanitizeString removes leading/trailing whitespace and normalizes
func SanitizeString(s string) string {
	return strings.TrimSpace(s)
}

// GenerateSlug creates a URL-friendly slug from a title
func GenerateSlug(title string) string {
	// Convert to lowercase
	slug := strings.ToLower(title)

	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")

	// Remove special characters
	reg := regexp.MustCompile(`[^a-z0-9\-]`)
	slug = reg.ReplaceAllString(slug, "")

	// Remove multiple consecutive hyphens
	reg = regexp.MustCompile(`-+`)
	slug = reg.ReplaceAllString(slug, "-")

	// Trim hyphens from start and end
	slug = strings.Trim(slug, "-")

	return slug
}

// TruncateString truncates a string to a maximum length
func TruncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}
