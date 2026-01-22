// backend/internal/models/portfolio.go
package models

import "time"

type PortfolioSection struct {
	ID           int       `json:"id"`
	Name         string    `json:"name"`
	Slug         string    `json:"slug"`
	Description  string    `json:"description"`
	DisplayOrder int       `json:"display_order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
