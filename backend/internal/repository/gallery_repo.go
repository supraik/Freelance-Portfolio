// backend/internal/repository/gallery_repo.go
package repository

import (
	"database/sql"

	"github.com/yourusername/portfolio-backend/internal/models"
)

// GalleryRepository handles database operations for galleries
type GalleryRepository struct {
	db *sql.DB
}

// NewGalleryRepository creates a new repository
func NewGalleryRepository(db *sql.DB) *GalleryRepository {
	return &GalleryRepository{db: db}
}

// GetAllCategories retrieves all gallery categories with their images
func (r *GalleryRepository) GetAllCategories() ([]models.GalleryCategory, error) {
	query := `
		SELECT id, slug, title, description, cover_image, display_order, created_at, updated_at
		FROM gallery_categories
		ORDER BY display_order ASC, created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []models.GalleryCategory
	for rows.Next() {
		var cat models.GalleryCategory
		if err := rows.Scan(
			&cat.ID,
			&cat.Slug,
			&cat.Title,
			&cat.Description,
			&cat.CoverImage,
			&cat.DisplayOrder,
			&cat.CreatedAt,
			&cat.UpdatedAt,
		); err != nil {
			return nil, err
		}

		// Load images for this category
		images, err := r.GetImagesByCategory(cat.ID)
		if err != nil {
			return nil, err
		}
		cat.Images = images

		categories = append(categories, cat)
	}

	return categories, nil
}

// GetCategoryBySlug retrieves a single category by slug
func (r *GalleryRepository) GetCategoryBySlug(slug string) (*models.GalleryCategory, error) {
	query := `
		SELECT id, slug, title, description, cover_image, display_order, created_at, updated_at
		FROM gallery_categories
		WHERE slug = $1
	`

	var cat models.GalleryCategory
	err := r.db.QueryRow(query, slug).Scan(
		&cat.ID,
		&cat.Slug,
		&cat.Title,
		&cat.Description,
		&cat.CoverImage,
		&cat.DisplayOrder,
		&cat.CreatedAt,
		&cat.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	// Load images
	images, err := r.GetImagesByCategory(cat.ID)
	if err != nil {
		return nil, err
	}
	cat.Images = images

	return &cat, nil
}

// GetImagesByCategory retrieves all images for a category
func (r *GalleryRepository) GetImagesByCategory(categoryID int) ([]models.GalleryImage, error) {
	query := `
		SELECT id, category_id, src, alt, aspect_ratio, display_order, created_at
		FROM gallery_images
		WHERE category_id = $1
		ORDER BY display_order ASC, created_at DESC
	`

	rows, err := r.db.Query(query, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []models.GalleryImage
	for rows.Next() {
		var img models.GalleryImage
		if err := rows.Scan(
			&img.ID,
			&img.CategoryID,
			&img.Src,
			&img.Alt,
			&img.AspectRatio,
			&img.DisplayOrder,
			&img.CreatedAt,
		); err != nil {
			return nil, err
		}
		images = append(images, img)
	}

	return images, nil
}

// CreateCategory creates a new gallery category
func (r *GalleryRepository) CreateCategory(cat *models.GalleryCategory) error {
	query := `
		INSERT INTO gallery_categories (slug, title, description, cover_image, display_order)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRow(query, cat.Slug, cat.Title, cat.Description, cat.CoverImage, cat.DisplayOrder).Scan(
		&cat.ID,
		&cat.CreatedAt,
		&cat.UpdatedAt,
	)
}

// UpdateCategory updates an existing category
func (r *GalleryRepository) UpdateCategory(cat *models.GalleryCategory) error {
	query := `
		UPDATE gallery_categories
		SET title = $1, description = $2, cover_image = $3, display_order = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
		RETURNING updated_at
	`

	return r.db.QueryRow(query, cat.Title, cat.Description, cat.CoverImage, cat.DisplayOrder, cat.ID).Scan(&cat.UpdatedAt)
}

// DeleteCategory deletes a category and all its images
func (r *GalleryRepository) DeleteCategory(id int) error {
	query := `DELETE FROM gallery_categories WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// CreateImage creates a new gallery image
func (r *GalleryRepository) CreateImage(img *models.GalleryImage) error {
	query := `
		INSERT INTO gallery_images (category_id, src, alt, aspect_ratio, display_order)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`

	return r.db.QueryRow(query, img.CategoryID, img.Src, img.Alt, img.AspectRatio, img.DisplayOrder).Scan(
		&img.ID,
		&img.CreatedAt,
	)
}

// DeleteImage deletes an image
func (r *GalleryRepository) DeleteImage(id int) error {
	query := `DELETE FROM gallery_images WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
