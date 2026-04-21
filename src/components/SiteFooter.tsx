import { Link } from "@tanstack/react-router";
import { Zap, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-lg font-bold tracking-tight">Nexora</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Engineering digital solutions that solve real-world problems and power the next generation of businesses.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-smooth">Home</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-smooth">Services</Link></li>
              <li><Link to="/products" className="hover:text-foreground transition-smooth">Products</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-smooth">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /><span>hello@nexora.tech</span></li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /><span>+1 (555) 010-2024</span></li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>Stockholm · Remote-first</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Nexora Technologies. All rights reserved.</p>
          <p>Built for the future.</p>
        </div>
      </div>
    </footer>
  );
}
