// backend/internal/services/storage.go
package services

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

// StorageService handles file storage operations
type StorageService struct {
	uploadDir    string
	maxFileSize  int64
	allowedTypes map[string]bool
}

// NewStorageService creates a new storage service
func NewStorageService(uploadDir string, maxFileSize int64) *StorageService {
	// Create upload directory if not exists
	os.MkdirAll(uploadDir, 0755)

	return &StorageService{
		uploadDir:   uploadDir,
		maxFileSize: maxFileSize,
		allowedTypes: map[string]bool{
			"image/jpeg": true,
			"image/jpg":  true,
			"image/png":  true,
			"image/webp": true,
			"image/gif":  true,
		},
	}
}

// SaveFile saves an uploaded file and returns the URL
func (s *StorageService) SaveFile(file *multipart.FileHeader) (string, error) {
	// Validate file size
	if file.Size > s.maxFileSize {
		return "", fmt.Errorf("file too large (max %d MB)", s.maxFileSize/1024/1024)
	}

	// Validate file type
	contentType := file.Header.Get("Content-Type")
	if !s.allowedTypes[contentType] {
		return "", fmt.Errorf("file type not allowed: %s", contentType)
	}

	// Open uploaded file
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	destPath := filepath.Join(s.uploadDir, filename)

	// Create destination file
	dst, err := os.Create(destPath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	// Copy content
	if _, err := io.Copy(dst, src); err != nil {
		return "", err
	}

	// Return public URL
	return "/uploads/" + filename, nil
}

// DeleteFile removes a file from storage
func (s *StorageService) DeleteFile(url string) error {
	// Extract filename from URL
	filename := strings.TrimPrefix(url, "/uploads/")
	filepath := filepath.Join(s.uploadDir, filename)

	return os.Remove(filepath)
}

// FileExists checks if a file exists in storage
func (s *StorageService) FileExists(url string) bool {
	filename := strings.TrimPrefix(url, "/uploads/")
	filepath := filepath.Join(s.uploadDir, filename)

	_, err := os.Stat(filepath)
	return err == nil
}

// GetFilePath returns the absolute path of a file
func (s *StorageService) GetFilePath(url string) string {
	filename := strings.TrimPrefix(url, "/uploads/")
	return filepath.Join(s.uploadDir, filename)
}
