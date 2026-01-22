-- Add portfolio sections table for fixed divs in portfolio page
CREATE TABLE IF NOT EXISTS portfolio_sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add Cloudinary fields to gallery_images
ALTER TABLE gallery_images 
    ADD COLUMN IF NOT EXISTS cloudinary_id VARCHAR(255),
    ADD COLUMN IF NOT EXISTS cloudinary_url TEXT,
    ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
    ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS section_id INTEGER REFERENCES portfolio_sections(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_section ON gallery_images(section_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_cloudinary ON gallery_images(cloudinary_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_sections_order ON portfolio_sections(display_order);

-- Insert default portfolio sections
INSERT INTO portfolio_sections (name, slug, description, display_order) VALUES
    ('Hero Section', 'hero', 'Main landing section with featured image', 1),
    ('About Section', 'about', 'About section images', 2),
    ('Services Section', 'services', 'Services and offerings', 3)
ON CONFLICT (slug) DO NOTHING;
