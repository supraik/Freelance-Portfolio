// backend/internal/services/cloudinary.go
package services

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"path/filepath"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/supraik/Freelance-Portfolio/internal/config"
)

// CloudinaryService handles image uploads to Cloudinary
type CloudinaryService struct {
	cld    *cloudinary.Cloudinary
	folder string
}

// NewCloudinaryService creates a new Cloudinary service
func NewCloudinaryService(cfg *config.Config) (*CloudinaryService, error) {
	cld, err := cloudinary.NewFromParams(
		cfg.CloudinaryCloudName,
		cfg.CloudinaryAPIKey,
		cfg.CloudinaryAPISecret,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryService{
		cld:    cld,
		folder: cfg.CloudinaryFolder,
	}, nil
}

// UploadResult contains the result of an upload operation
type UploadResult struct {
	PublicID     string
	SecureURL    string
	ThumbnailURL string
	Width        int
	Height       int
	Format       string
	Size         int64
}

// UploadImage uploads an image to Cloudinary
func (s *CloudinaryService) UploadImage(ctx context.Context, file multipart.File, filename string) (*UploadResult, error) {
	// Upload to Cloudinary
	uploadResult, err := s.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder:         s.folder,
		PublicID:       generatePublicID(filename),
		Transformation: "q_auto,f_auto",
	})
	if err != nil {
		return nil, fmt.Errorf("failed to upload to Cloudinary: %w", err)
	}

	// Generate thumbnail URL manually
	thumbnailURL := fmt.Sprintf(
		"https://res.cloudinary.com/%s/image/upload/c_fill,w_400,h_300,q_auto/%s",
		s.cld.Config.Cloud.CloudName,
		uploadResult.PublicID,
	)

	return &UploadResult{
		PublicID:     uploadResult.PublicID,
		SecureURL:    uploadResult.SecureURL,
		ThumbnailURL: thumbnailURL,
		Width:        uploadResult.Width,
		Height:       uploadResult.Height,
		Format:       uploadResult.Format,
		Size:         int64(uploadResult.Bytes),
	}, nil
}

// DeleteImage deletes an image from Cloudinary
func (s *CloudinaryService) DeleteImage(ctx context.Context, publicID string) error {
	_, err := s.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	if err != nil {
		return fmt.Errorf("failed to delete from Cloudinary: %w", err)
	}
	return nil
}

// UploadMultiple uploads multiple images
func (s *CloudinaryService) UploadMultiple(ctx context.Context, files []multipart.File, filenames []string) ([]*UploadResult, error) {
	results := make([]*UploadResult, 0, len(files))

	for i, file := range files {
		// Reset file pointer
		if seeker, ok := file.(io.Seeker); ok {
			seeker.Seek(0, 0)
		}

		result, err := s.UploadImage(ctx, file, filenames[i])
		if err != nil {
			// Cleanup previously uploaded images on error
			for _, r := range results {
				s.DeleteImage(ctx, r.PublicID)
			}
			return nil, fmt.Errorf("failed to upload image %s: %w", filenames[i], err)
		}
		results = append(results, result)
	}

	return results, nil
}

// generatePublicID creates a unique public ID for Cloudinary
func generatePublicID(filename string) string {
	ext := filepath.Ext(filename)
	name := filename[:len(filename)-len(ext)]
	// Cloudinary will auto-generate unique ID if there's a conflict
	return name
}
