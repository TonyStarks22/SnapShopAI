import { Link } from "wouter";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Menu } from "lucide-react";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="SnapShop Logo" 
              className="h-10 w-10 transition-transform group-hover:scale-105" 
            />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Snap<span className="text-primary">Shop</span>
            </span>
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/"><a className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Home</a></Link>
          <Link href="/explore"><a className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Explore</a></Link>
          <Link href="/categories"><a className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Categories</a></Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/5">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-white/5 relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-secondary animate-pulse" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
