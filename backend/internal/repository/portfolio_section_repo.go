// backend/internal/repository/portfolio_section_repo.go
package repository

import (
	"context"
	"database/sql"

	"github.com/supraik/Freelance-Portfolio/internal/models"
)

type PortfolioSectionRepository struct {
	db *sql.DB
}

func NewPortfolioSectionRepository(db *sql.DB) *PortfolioSectionRepository {
	return &PortfolioSectionRepository{db: db}
}

// GetAll returns all portfolio sections
func (r *PortfolioSectionRepository) GetAll(ctx context.Context) ([]models.PortfolioSection, error) {
	query := `
		SELECT id, name, slug, description, display_order, created_at, updated_at
		FROM portfolio_sections
		ORDER BY display_order ASC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sections []models.PortfolioSection
	for rows.Next() {
		var section models.PortfolioSection
		err := rows.Scan(
			&section.ID,
			&section.Name,
			&section.Slug,
			&section.Description,
			&section.DisplayOrder,
			&section.CreatedAt,
			&section.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		sections = append(sections, section)
	}

	return sections, nil
}

// UpdateImage updates the featured image for a section
func (r *PortfolioSectionRepository) UpdateImage(ctx context.Context, sectionID int, cloudinaryID, imageURL string) error {
	query := `
		UPDATE portfolio_sections
		SET updated_at = NOW()
		WHERE id = $1
	`

	_, err := r.db.ExecContext(ctx, query, sectionID)
	return err
}
