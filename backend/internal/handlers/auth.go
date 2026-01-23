// backend/internal/handlers/auth.go
package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"github.com/supraik/Freelance-Portfolio/internal/config"
	"github.com/supraik/Freelance-Portfolio/internal/middleware"
	"github.com/supraik/Freelance-Portfolio/internal/models"
	"github.com/supraik/Freelance-Portfolio/internal/repository"
	"github.com/supraik/Freelance-Portfolio/pkg/response"
)

// AuthHandler handles authentication requests
type AuthHandler struct {
	repo     *repository.UserRepository
	config   *config.Config
	validate *validator.Validate
}

// NewAuthHandler creates a new handler
func NewAuthHandler(repo *repository.UserRepository, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		repo:     repo,
		config:   cfg,
		validate: validator.New(),
	}
}

// Login handles POST /api/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request")
		return
	}

	// Validate input
	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(c, err)
		return
	}

	// Log the email being attempted (for debugging)
	println("Login attempt with email:", req.Email)

	// Find user
	user, err := h.repo.GetByEmail(req.Email)
	if err != nil {
		println("User not found:", req.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found with email: " + req.Email})
		return
	}

	println("User found:", user.Email, "ID:", user.ID)

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Password mismatch", "email": req.Email})
		return
	}

	// Generate JWT
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &middleware.Claims{
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.config.JWTSecret))
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	// Update last login
	h.repo.UpdateLastLogin(user.ID)

	response.Success(c, http.StatusOK, "Login successful", models.LoginResponse{
		Token: tokenString,
		User: models.UserInfo{
			ID:       user.ID,
			Email:    user.Email,
			Name:     user.Name,
			Username: user.Username,
			Role:     "admin", // All users in this system are admins
		},
	})
}

// Register handles POST /api/auth/register (optional - for creating first admin)
func (h *AuthHandler) Register(c *gin.Context) {
	var req struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=8"`
		Name     string `json:"name" validate:"required,min=2"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request")
		return
	}

	// Validate input
	if err := h.validate.Struct(req); err != nil {
		response.ValidationError(c, err)
		return
	}

	// Check if email exists
	exists, err := h.repo.EmailExists(req.Email)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Database error")
		return
	}
	if exists {
		response.Error(c, http.StatusBadRequest, "Email already registered")
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	// Create user
	user := &models.User{
		Email:        req.Email,
		PasswordHash: string(hashedPassword),
		Name:         req.Name,
	}

	if err := h.repo.Create(user); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	response.Success(c, http.StatusCreated, "User created successfully", models.UserInfo{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
	})
}
