// backend/internal/models/gallery.go
package models

import "time"

// GalleryCategory represents a gallery category/album
type GalleryCategory struct {
	ID           int            `json:"id"`
	Slug         string         `json:"slug" validate:"required,slug"`
	Title        string         `json:"title" validate:"required,min=2,max=255"`
	Description  string         `json:"description"`
	CoverImage   string         `json:"cover_image"`
	DisplayOrder int            `json:"display_order"`
	Images       []GalleryImage `json:"images"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
}

// GalleryImage represents an image in a gallery
type GalleryImage struct {
	ID           int       `json:"id"`
	CategoryID   int       `json:"category_id"`
	Src          string    `json:"src" validate:"required"`
	Alt          string    `json:"alt"`
	AspectRatio  string    `json:"aspect_ratio"` // "portrait", "landscape", "square"
	DisplayOrder int       `json:"display_order"`
	CreatedAt    time.Time `json:"created_at"`
}
