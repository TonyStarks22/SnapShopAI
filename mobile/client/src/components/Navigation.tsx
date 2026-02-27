import { Link } from "wouter";
import logo from "@/assets/logo.png"; // Vite will resolve to the hashed PNG
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Menu } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <picture>
              {/* WebP sources with multiple resolutions */}
              <source
                srcSet="/logo-200.webp 200w, /logo-400.webp 400w"
                sizes="(max-width: 768px) 200px, 91px"
                type="image/webp"
              />
              {/* Fallback PNG (imported, hashed) */}
              <img
                src={logo}
                alt="SnapShop Logo"
                width={400}
                height={400}
                className="h-13 w-13 transition-transform group-hover:scale-105"
              />
            </picture>
            <span className="font-display font-bold text-xl tracking-tight text-[#C4C4C4]">
              Snap<span className="text-primary">Shop</span>
            </span>
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/"><a className="text-sm font-medium text-muted-foreground hover:text-[#C4C4C4] transition-colors">Home</a></Link>
          <Link href="/explore"><a className="text-sm font-medium text-muted-foreground hover:text-[#C4C4C4] transition-colors">Explore</a></Link>
          <Link href="/categories"><a className="text-sm font-medium text-muted-foreground hover:text-[#C4C4C4] transition-colors">Categories</a></Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-[#C4C4C4] hover:text-primary hover:bg-white/5">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#C4C4C4] hover:text-primary hover:bg-white/5 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-[#C4C4C4]">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}