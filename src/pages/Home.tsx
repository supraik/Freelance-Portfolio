import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { siteConfig, heroContent } from "@/data/portfolioContent";

const Home = () => {
  return (
    <div className="relative min-h-screen bg-foreground">
      {/* Hero Section - Full Screen */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroContent.image}
            alt={siteConfig.name}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-foreground/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 via-transparent to-transparent" />
        </motion.div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="block font-body text-xs md:text-sm tracking-editorial-wide text-primary-foreground/70 mb-4 uppercase"
            >
              {siteConfig.tagline}
            </motion.span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-editorial text-primary-foreground">
              {siteConfig.name.toUpperCase()}
            </h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1 }}
              className="h-px bg-primary-foreground/30 mt-8 mx-auto max-w-[200px]"
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <Link
            to="/galleries"
            className="flex flex-col items-center gap-3 group"
          >
            <span className="font-body text-xs tracking-editorial uppercase text-primary-foreground/60 group-hover:text-primary-foreground transition-colors">
              {heroContent.scrollText}
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-primary-foreground/60 group-hover:text-primary-foreground transition-colors" />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Featured Categories Preview */}
      <section className="py-24 md:py-32 lg:py-40 bg-background">
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="block font-body text-xs tracking-editorial-wide text-muted-foreground mb-4 uppercase">
              Portfolio
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light tracking-editorial text-foreground">
              EDITORIAL WORK
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/galleries"
              className="inline-flex items-center gap-4 group"
            >
              <span className="font-body text-sm tracking-editorial uppercase text-foreground/80 group-hover:text-foreground transition-colors">
                View All Galleries
              </span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
