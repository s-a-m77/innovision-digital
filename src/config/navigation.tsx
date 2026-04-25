import * as React from "react";
import { Home, Briefcase, Package, Mail, Newspaper } from "lucide-react";

export interface NavMenuItem {
  id: number;
  title: string;
  url: "/" | "/services" | "/products" | "/contact" | "/blog";
  icon: React.ReactNode;
}

/**
 * Shared site navigation config.
 * Single source of truth for header, scroll navigation menu, and footer links.
 * Keep in sync with the route files in `src/routes/`.
 */
export const navMenuItems: NavMenuItem[] = [
  { id: 1, title: "Home", url: "/", icon: <Home className="h-4 w-4" /> },
  { id: 2, title: "Services", url: "/services", icon: <Briefcase className="h-4 w-4" /> },
  { id: 3, title: "Products", url: "/products", icon: <Package className="h-4 w-4" /> },
  { id: 4, title: "Blog", url: "/blog", icon: <Newspaper className="h-4 w-4" /> },
  { id: 5, title: "Contact", url: "/contact", icon: <Mail className="h-4 w-4" /> },
];
