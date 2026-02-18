import heroImage from "@/assets/hero-scan.png";
import { SnapSearch } from "./SnapSearch";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
      
      {/* Background with Gradient Mesh */}
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] opacity-40 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] opacity-40 -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Text */}
        <div className="space-y-8 text-center lg:text-left pt-10 lg:pt-0">
          <Badge variant="outline" className="border-primary/50 text-primary uppercase tracking-widest px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full">
            SI-Powered Synthetic Intelligence
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tighter text-white">
            Snap.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Find.</span><br/>
            Buy.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Stop typing vague descriptions. Just snap a photo and let our AI find the exact product you're looking for in seconds.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/10 border border-black flex items-center justify-center text-xs font-bold text-white">
                  {i}
                </div>
              ))}
            </div>
            <p>Trusted by 10k+ shoppers</p>
          </div>
        </div>

        {/* Right Column: Interactive Demo */}
        <div className="relative">
          <SnapSearch />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground">
        <ArrowDown className="w-6 h-6" />
      </div>
    </section>
  );
}
