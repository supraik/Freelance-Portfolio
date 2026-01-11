import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig, navigation } from "@/data/portfolioContent";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
      >
        <div className="editorial-container">
          <div className="flex items-center justify-between py-6 md:py-8">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="font-display text-lg md:text-xl tracking-editorial text-white hover:opacity-70 transition-opacity duration-300"
            >
              {siteConfig.name.toUpperCase()}
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`link-elegant font-body text-sm tracking-wider uppercase text-white transition-opacity duration-300 ${
                    location.pathname === item.href ? "opacity-100" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-white hover:opacity-70 transition-opacity"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-foreground md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              <Link
                to="/"
                onClick={closeMenu}
                className="font-display text-2xl tracking-editorial text-primary-foreground hover:opacity-70 transition-opacity"
              >
                Home
              </Link>
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    className={`font-display text-2xl tracking-editorial transition-opacity ${
                      location.pathname === item.href
                        ? "text-primary-foreground"
                        : "text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
