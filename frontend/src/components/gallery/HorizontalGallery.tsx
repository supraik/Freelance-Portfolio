import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { galleryCategories } from "@/data/portfolioContent";

const HorizontalGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);

      // Calculate active category based on scroll position
      const categoryWidth = container.scrollWidth / galleryCategories.length;
      const newIndex = Math.min(
        Math.floor((scrollLeft + container.clientWidth / 2) / categoryWidth),
        galleryCategories.length - 1
      );
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCategory = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    const categoryWidth = container.scrollWidth / galleryCategories.length;
    container.scrollTo({
      left: categoryWidth * index,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Horizontal Scrolling Container */}
      <div
        ref={containerRef}
        className="flex h-full overflow-x-auto hide-scrollbar snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {galleryCategories.map((category, index) => (
          <Link
            key={category.id}
            to={`/galleries/${category.id}`}
            className="relative flex-shrink-0 w-screen h-full snap-center group cursor-pointer"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <motion.div
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full"
              >
                <img
                  src={category.coverImage}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </motion.div>
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
            </div>

            {/* Category Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 md:pb-32 lg:pb-40">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                viewport={{ once: true }}
                className="text-center"
              >
                <span className="block font-body text-xs tracking-editorial-wide text-primary-foreground/70 mb-3 uppercase">
                  {category.description}
                </span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-light tracking-editorial-wide text-primary-foreground">
                  {category.title.toUpperCase()}
                </h2>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-px bg-primary-foreground/30 mt-6 mx-auto max-w-[120px]"
                />
              </motion.div>
            </div>

            {/* View Gallery Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="font-body text-xs tracking-editorial uppercase text-primary-foreground/80">
                View Gallery
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {galleryCategories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => scrollToCategory(index)}
            className={`w-8 h-0.5 transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary-foreground"
                : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Go to ${category.title}`}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress === 0 ? 1 : 0 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary-foreground/50 to-transparent" />
          <span className="font-body text-xs tracking-editorial uppercase text-primary-foreground/60 [writing-mode:vertical-rl]">
            Scroll
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default HorizontalGallery;
