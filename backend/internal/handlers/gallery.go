// backend/internal/handlers/gallery.go
package handlers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"

	"github.com/supraik/Freelance-Portfolio/internal/models"
	"github.com/supraik/Freelance-Portfolio/internal/repository"
	"github.com/supraik/Freelance-Portfolio/pkg/response"
)

// GalleryHandler handles gallery requests
type GalleryHandler struct {
	repo     *repository.GalleryRepository
	validate *validator.Validate
}

// NewGalleryHandler creates a new handler
func NewGalleryHandler(repo *repository.GalleryRepository) *GalleryHandler {
	return &GalleryHandler{
		repo:     repo,
		validate: validator.New(),
	}
}

// GetAll handles GET /api/galleries
func (h *GalleryHandler) GetAll(c *gin.Context) {
	categories, err := h.repo.GetAllCategories()
	if err != nil {
		log.Printf("Failed to fetch galleries: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to fetch galleries")
		return
	}

	response.Success(c, http.StatusOK, "Galleries retrieved", categories)
}

// GetBySlug handles GET /api/galleries/:slug
func (h *GalleryHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	category, err := h.repo.GetCategoryBySlug(slug)
	if err != nil {
		log.Printf("Gallery not found: %s - %v", slug, err)
		response.Error(c, http.StatusNotFound, "Gallery not found")
		return
	}

	response.Success(c, http.StatusOK, "Gallery retrieved", category)
}

// Create handles POST /api/admin/galleries
func (h *GalleryHandler) Create(c *gin.Context) {
	var category models.GalleryCategory

	if err := c.ShouldBindJSON(&category); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := h.repo.CreateCategory(&category); err != nil {
		log.Printf("Failed to create gallery: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to create gallery")
		return
	}

	response.Success(c, http.StatusCreated, "Gallery created successfully", category)
}

// Update handles PUT /api/admin/galleries/:id
func (h *GalleryHandler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid gallery ID")
		return
	}

	var category models.GalleryCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	category.ID = id

	if err := h.repo.UpdateCategory(&category); err != nil {
		log.Printf("Failed to update gallery: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to update gallery")
		return
	}

	response.Success(c, http.StatusOK, "Gallery updated successfully", category)
}

// Delete handles DELETE /api/admin/galleries/:id
func (h *GalleryHandler) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid gallery ID")
		return
	}

	if err := h.repo.DeleteCategory(id); err != nil {
		log.Printf("Failed to delete gallery: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to delete gallery")
		return
	}

	response.Success(c, http.StatusOK, "Gallery deleted successfully", nil)
}

// CreateImage handles POST /api/admin/galleries/:id/images
func (h *GalleryHandler) CreateImage(c *gin.Context) {
	idParam := c.Param("id")
	categoryID, err := strconv.Atoi(idParam)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid gallery ID")
		return
	}

	var image models.GalleryImage
	if err := c.ShouldBindJSON(&image); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid request body")
		return
	}

	image.CategoryID = categoryID

	if err := h.repo.CreateImage(&image); err != nil {
		log.Printf("Failed to create image: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to create image")
		return
	}

	response.Success(c, http.StatusCreated, "Image created successfully", image)
}

// DeleteImage handles DELETE /api/admin/images/:id
func (h *GalleryHandler) DeleteImage(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid image ID")
		return
	}

	if err := h.repo.DeleteImage(id); err != nil {
		log.Printf("Failed to delete image: %v", err)
		response.Error(c, http.StatusInternalServerError, "Failed to delete image")
		return
	}

	response.Success(c, http.StatusOK, "Image deleted successfully", nil)
}
