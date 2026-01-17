import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { galleryCategories } from "@/data/portfolioContent";
import ImageGrid from "@/components/gallery/ImageGrid";

const GalleryCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = galleryCategories.find((cat) => cat.id === categoryId);

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
          <ImageGrid images={category.images} />
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
