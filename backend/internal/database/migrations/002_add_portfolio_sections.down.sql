-- Remove added columns from gallery_images
ALTER TABLE gallery_images 
    DROP COLUMN IF EXISTS section_id,
    DROP COLUMN IF EXISTS display_order,
    DROP COLUMN IF EXISTS thumbnail_url,
    DROP COLUMN IF EXISTS cloudinary_url,
    DROP COLUMN IF EXISTS cloudinary_id;

-- Drop portfolio_sections table
DROP TABLE IF EXISTS portfolio_sections;
