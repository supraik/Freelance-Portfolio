import { useState } from "react";
import { motion } from "framer-motion";
import { GalleryImage } from "@/data/portfolioContent";
import Lightbox from "./Lightbox";

interface ImageGridProps {
  images: GalleryImage[];
}

const ImageGrid = ({ images }: ImageGridProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getGridClass = (aspectRatio: GalleryImage["aspectRatio"], index: number) => {
    // Create visual variety in the grid
    const isLarge = index % 5 === 0;
    
    if (aspectRatio === "landscape") {
      return isLarge ? "col-span-2 row-span-1" : "col-span-2 row-span-1 md:col-span-1";
    }
    if (aspectRatio === "square") {
      return "col-span-1 row-span-1";
    }
    // Portrait
    return isLarge ? "col-span-1 row-span-2" : "col-span-1 row-span-1 md:row-span-2";
  };

  const getAspectClass = (aspectRatio: GalleryImage["aspectRatio"]) => {
    switch (aspectRatio) {
      case "landscape":
        return "aspect-[4/3]";
      case "square":
        return "aspect-square";
      case "portrait":
      default:
        return "aspect-[3/4]";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
            className={getGridClass(image.aspectRatio, index)}
          >
            <button
              onClick={() => openLightbox(index)}
              className="image-editorial w-full h-full block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`View ${image.alt} in fullscreen`}
            >
              <div className={`relative overflow-hidden ${getAspectClass(image.aspectRatio)} bg-muted`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <Lightbox
        images={images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

export default ImageGrid;
