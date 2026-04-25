import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { navMenuItems, type NavMenuItem } from "@/config/navigation";

interface ScrollNavbarProps {
  menuItems?: NavMenuItem[];
  className?: string;
}

export const ScrollNavigationMenu: React.FC<ScrollNavbarProps> = ({
  menuItems = navMenuItems,
  className = "",
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 100);
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        when: "afterChildren" as const,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        when: "beforeChildren" as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0, scale: 0.8 },
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 },
    },
  };

  return (
    <>
      {/* Full Navbar - visible when not scrolled */}
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: isScrolled ? -100 : 0,
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg ${className}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow transition-smooth group-hover:scale-105">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="text-lg font-bold tracking-tight">Nexora</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1 relative">
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  to={item.url}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground rounded-md transition-smooth hover:text-foreground"
                  activeProps={{ className: "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-foreground" }}
                  activeOptions={{ exact: item.url === "/" }}
                >
                  {item.icon}
                  {item.title}
                </Link>
                {hoveredItem === item.id && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 -z-10 rounded-md bg-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant transition-smooth hover:shadow-glow hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Floating Hamburger - visible when scrolled */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isScrolled ? 1 : 0,
          opacity: isScrolled ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow"
        aria-label="Open menu"
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.div>
      </motion.button>

      {/* Floating Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            />

            {/* Menu Container */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-20 right-6 z-50 w-72 origin-top-right rounded-2xl border border-border bg-card p-6 shadow-elegant"
            >
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={toggleMenu}
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-smooth"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Menu Items */}
                <nav className="flex flex-col gap-2 pt-4">
                  {menuItems.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <Link
                        to={item.url}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
                        activeProps={{ className: "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium bg-secondary text-foreground" }}
                        activeOptions={{ exact: item.url === "/" }}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground">
                          {item.icon}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Decorative glow */}
                <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
