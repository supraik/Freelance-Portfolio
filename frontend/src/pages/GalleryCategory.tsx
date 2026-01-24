import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { galleryCategories, GalleryImage } from "@/data/portfolioContent";
import ImageGrid from "@/components/gallery/ImageGrid";
import AdminImageGrid, { AdminGalleryImage } from "@/components/admin/AdminImageGrid";
import { useAuthStore } from "@/stores/authStore";
import { galleryAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const GalleryCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { isAdmin } = useAuthStore();
  const { toast } = useToast();
  
  const staticCategory = galleryCategories.find((cat) => cat.id === categoryId);
  const [category, setCategory] = useState(staticCategory);
  const [images, setImages] = useState<GalleryImage[]>(staticCategory?.images || []);
  const [adminImages, setAdminImages] = useState<AdminGalleryImage[]>([]);
  const [dbCategoryId, setDbCategoryId] = useState<number | null>(null);

  // Fetch gallery data from backend if admin
  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!categoryId || !isAdmin) return;
      
      try {
        const response = await galleryAPI.getBySlug(categoryId);
        if (response.success && response.data) {
          setDbCategoryId(response.data.id);
          if (response.data.images && response.data.images.length > 0) {
            // Map backend images to admin format (with IDs)
            const mappedImages: AdminGalleryImage[] = response.data.images.map((img: any) => ({
              id: img.id,
              src: img.src,
              alt: img.alt || '',
              aspectRatio: img.aspect_ratio as "portrait" | "landscape" | "square",
            }));
            setAdminImages(mappedImages);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery data:', error);
      }
    };

    fetchGalleryData();
  }, [categoryId, isAdmin]);

  const handleImageUpdate = async (imageId: number, file: File) => {
    try {
      const response = await galleryAPI.updateImage(imageId, file);
      
      // Update local state
      setAdminImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, src: response.data.src, alt: response.data.alt || img.alt }
          : img
      ));
    } catch (error) {
      throw error;
    }
  };

  const handleImageDelete = async (imageId: number) => {
    try {
      await galleryAPI.deleteImage(imageId);
      
      // Remove from local state
      setAdminImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      throw error;
    }
  };

  const handleImageAdd = async (file: File) => {
    if (!dbCategoryId) {
      toast({
        title: "Error",
        description: "Gallery not found in database",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await galleryAPI.uploadImage(
        dbCategoryId,
        file,
        file.name,
        'portrait' // Default to portrait, could add selection UI
      );
      
      const newImage: AdminGalleryImage = {
        id: response.data.id,
        src: response.data.src,
        alt: response.data.alt,
        aspectRatio: response.data.aspect_ratio,
      };
      
      setAdminImages(prev => [...prev, newImage]);
    } catch (error) {
      throw error;
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-display text-2xl tracking-editorial text-foreground mb-4">
            Category Not Found
          </h1>
          <Link
            to="/galleries"
            className="font-body text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Galleries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={category.coverImage}
            alt={category.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-foreground/20" />
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-24 md:top-28 left-6 md:left-12 lg:left-24"
        >
          <Link
            to="/galleries"
            className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-body text-sm tracking-wider uppercase">
              All Galleries
            </span>
          </Link>
        </motion.div>

        {/* Category Title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <span className="block font-body text-xs tracking-editorial-wide text-primary-foreground/60 mb-4 uppercase">
              {category.description}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-editorial-wide text-primary-foreground">
              {category.title.toUpperCase()}
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-px bg-primary-foreground/30 mt-8 mx-auto max-w-[150px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="editorial-container">
          {isAdmin && dbCategoryId && adminImages.length > 0 ? (
            <AdminImageGrid
              images={adminImages}
              categoryId={dbCategoryId}
              onImageUpdate={handleImageUpdate}
              onImageDelete={handleImageDelete}
              onImageAdd={handleImageAdd}
            />
          ) : (
            <ImageGrid images={images} />
          )}
        </div>
      </section>

      {/* Navigation to Other Categories */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="block font-body text-xs tracking-editorial-wide text-muted-foreground mb-6 uppercase">
              Explore More
            </span>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {galleryCategories
                .filter((cat) => cat.id !== categoryId)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/galleries/${cat.id}`}
                    className="link-elegant font-display text-lg md:text-xl tracking-editorial text-foreground/70 hover:text-foreground transition-colors"
                  >
                    {cat.title.toUpperCase()}
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GalleryCategory;
