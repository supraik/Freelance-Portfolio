// backend/internal/handlers/portfolio.go
package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/supraik/Freelance-Portfolio/internal/repository"
	"github.com/supraik/Freelance-Portfolio/internal/services"
)

type PortfolioHandler struct {
	sectionRepo *repository.PortfolioSectionRepository
	imageRepo   *repository.GalleryRepository
	cloudinary  *services.CloudinaryService
}

func NewPortfolioHandler(sectionRepo *repository.PortfolioSectionRepository, imageRepo *repository.GalleryRepository, cloudinary *services.CloudinaryService) *PortfolioHandler {
	return &PortfolioHandler{
		sectionRepo: sectionRepo,
		imageRepo:   imageRepo,
		cloudinary:  cloudinary,
	}
}

// GetSections returns all portfolio sections
func (h *PortfolioHandler) GetSections(c *gin.Context) {
	sections, err := h.sectionRepo.GetAll(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sections"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"sections": sections})
}

// UpdateSectionImage updates the featured image for a section
func (h *PortfolioHandler) UpdateSectionImage(c *gin.Context) {
	sectionIDStr := c.Param("id")
	sectionID, err := strconv.Atoi(sectionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid section ID"})
		return
	}

	// Get uploaded file
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No image provided"})
		return
	}
	defer file.Close()

	// Upload to Cloudinary
	result, err := h.cloudinary.UploadImage(c.Request.Context(), file, header.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	// Update section with new image
	err = h.sectionRepo.UpdateImage(c.Request.Context(), sectionID, result.PublicID, result.SecureURL)
	if err != nil {
		// Cleanup uploaded image
		h.cloudinary.DeleteImage(c.Request.Context(), result.PublicID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update section"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Image updated successfully",
		"image": gin.H{
			"url":       result.SecureURL,
			"thumbnail": result.ThumbnailURL,
		},
	})
}
