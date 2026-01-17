// backend/internal/handlers/upload.go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/supraik/Freelance-Portfolio/internal/services"
	"github.com/supraik/Freelance-Portfolio/pkg/response"
)

// UploadHandler handles file upload requests
type UploadHandler struct {
	storage *services.StorageService
}

// NewUploadHandler creates a new handler
func NewUploadHandler(storage *services.StorageService) *UploadHandler {
	return &UploadHandler{storage: storage}
}

// Upload handles POST /api/admin/upload
func (h *UploadHandler) Upload(c *gin.Context) {
	// Get file from form
	file, err := c.FormFile("file")
	if err != nil {
		response.Error(c, http.StatusBadRequest, "No file uploaded")
		return
	}

	// Save file
	url, err := h.storage.SaveFile(file)
	if err != nil {
		response.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	response.Success(c, http.StatusOK, "File uploaded successfully", gin.H{
		"url": url,
	})
}

// UploadMultiple handles multiple file uploads
func (h *UploadHandler) UploadMultiple(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid form data")
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		response.Error(c, http.StatusBadRequest, "No files uploaded")
		return
	}

	var urls []string

	for _, file := range files {
		url, err := h.storage.SaveFile(file)
		if err != nil {
			response.Error(c, http.StatusBadRequest, err.Error())
			return
		}
		urls = append(urls, url)
	}

	response.Success(c, http.StatusOK, "Files uploaded successfully", gin.H{
		"urls": urls,
	})
}
