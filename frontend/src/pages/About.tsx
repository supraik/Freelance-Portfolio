import { motion } from "framer-motion";
import { aboutContent, siteConfig } from "@/data/portfolioContent";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="editorial-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="block font-body text-xs tracking-editorial-wide text-muted-foreground mb-4 uppercase">
              About
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-editorial text-foreground">
              {siteConfig.name.toUpperCase()}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 md:pb-32 lg:pb-40">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Feature Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="image-editorial"
            >
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={aboutContent.featureImage}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Bio Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="lg:pt-12"
            >
              <h2 className="font-display text-2xl md:text-3xl tracking-editorial text-foreground mb-8">
                THE MODEL
              </h2>
              
              <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed mb-12">
                {aboutContent.bio}
              </p>

              {/* Professional Details */}
              {aboutContent.details && (
                <div className="space-y-4 border-t border-border pt-8">
                  {aboutContent.details.location && (
                    <div className="flex justify-between items-center">
                      <span className="font-body text-sm tracking-wider uppercase text-muted-foreground">
                        Location
                      </span>
                      <span className="font-body text-sm text-foreground">
                        {aboutContent.details.location}
                      </span>
                    </div>
                  )}
                  {aboutContent.details.height && (
                    <div className="flex justify-between items-center">
                      <span className="font-body text-sm tracking-wider uppercase text-muted-foreground">
                        Height
                      </span>
                      <span className="font-body text-sm text-foreground">
                        {aboutContent.details.height}
                      </span>
                    </div>
                  )}
                  {aboutContent.details.experience && (
                    <div className="flex justify-between items-center">
                      <span className="font-body text-sm tracking-wider uppercase text-muted-foreground">
                        Experience
                      </span>
                      <span className="font-body text-sm text-foreground">
                        {aboutContent.details.experience}
                      </span>
                    </div>
                  )}
                  {aboutContent.details.agencies && (
                    <div className="flex justify-between items-center">
                      <span className="font-body text-sm tracking-wider uppercase text-muted-foreground">
                        Representation
                      </span>
                      <span className="font-body text-sm text-foreground">
                        {aboutContent.details.agencies}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
