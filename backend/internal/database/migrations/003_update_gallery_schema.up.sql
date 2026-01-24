-- Create gallery_categories table (replaces galleries table)
CREATE TABLE IF NOT EXISTS gallery_categories (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    cover_image VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Drop old galleries table if exists and migrate data
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS galleries CASCADE;

-- Recreate gallery_images with new schema
CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES gallery_categories(id) ON DELETE CASCADE,
    src VARCHAR(500) NOT NULL,
    alt VARCHAR(255),
    aspect_ratio VARCHAR(20) DEFAULT 'portrait',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category_id ON gallery_images(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(category_id, display_order);

-- Insert default gallery categories
INSERT INTO gallery_categories (slug, title, description, cover_image, display_order)
VALUES 
    ('wedding', 'Wedding', 'Bridal & Wedding Editorials', '/placeholder.svg', 1),
    ('saree-branding', 'Saree Branding', 'Traditional Saree Campaigns', '/placeholder.svg', 2),
    ('makeup', 'Makeup', 'Beauty & Makeup Artistry', '/placeholder.svg', 3),
    ('aesthetic', 'Aesthetic', 'Artistic & Creative Work', '/placeholder.svg', 4)
ON CONFLICT (slug) DO NOTHING;
